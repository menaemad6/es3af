import { useState, useCallback } from 'react';
import { fetchAI } from '@/utils/geminiConfig';
import { extractTextFromPDF, splitTextIntoChunks } from '@/services/pdf';
import { QuizQuestion, QuizCreationData } from '@/types/quiz';

interface UseQuizGenerationOptions {
  temperature?: number;
  maxTokens?: number;
  questionCount?: number;
  maxChunkSize?: number;
  questionsPerChunk?: number;
}

interface QuizGenerationResult {
  success: boolean;
  questions?: QuizQuestion[];
  title?: string;
  description?: string;
  recommendedTime?: number; // in minutes
  error?: string;
  sourceText?: string;
  extractionMethod?: 'pdfjs' | 'ocr';
}

export function useQuizGeneration(options: UseQuizGenerationOptions = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{
    stage: 'extracting' | 'analyzing' | 'generating' | 'finalizing';
    message: string;
    progress: number;
  } | null>(null);

  const { 
    temperature = 0.3, 
    maxTokens = 2000, // Reduced token usage
    questionCount = 5,
    maxChunkSize = 3000, // Smaller chunks for faster processing
    questionsPerChunk = 8 // Reduced questions per chunk
  } = options;

  /**
   * Robust JSON parsing with multiple fallback strategies
   */
  const parseAIResponse = useCallback((responseContent: string): Record<string, unknown> => {
    // Strategy 1: Direct JSON parse
    try {
      return JSON.parse(responseContent);
    } catch (e) {
      console.warn('Direct JSON parse failed, trying fallback strategies...');
    }

    // Strategy 2: Extract JSON from markdown code blocks
    const codeBlockMatch = responseContent.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (codeBlockMatch) {
      try {
        return JSON.parse(codeBlockMatch[1]);
      } catch (e) {
        console.warn('Code block JSON parse failed');
      }
    }

    // Strategy 3: Find JSON object in the text
    const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.warn('Regex JSON parse failed');
      }
    }

    // Strategy 4: Try to fix common JSON issues
    let cleanedContent = responseContent
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*```\s*$/gm, '')
      .trim();

    // Fix trailing commas
    cleanedContent = cleanedContent.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings
    cleanedContent = cleanedContent.replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":');

    try {
      return JSON.parse(cleanedContent);
    } catch (e) {
      console.warn('Cleaned JSON parse failed');
    }

    // Strategy 5: Try to extract questions array directly
    const questionsMatch = responseContent.match(/questions\s*:\s*\[([\s\S]*?)\]/);
    if (questionsMatch) {
      try {
        const questionsArray = JSON.parse(`[${questionsMatch[1]}]`);
        return { questions: questionsArray };
      } catch (e) {
        console.warn('Questions array extraction failed');
      }
    }

    throw new Error(`Failed to parse AI response. Content preview: ${responseContent.substring(0, 200)}...`);
  }, []);

  /**
   * Generates title, description, and recommended time based on content
   */
  const generateTitleAndDescription = useCallback(async (firstChunk: string, totalTextLength: number, isNonMedical: boolean = false): Promise<{
    title: string;
    description: string;
    recommendedTime: number;
  }> => {
    try {
      const systemPrompt = isNonMedical 
        ? `You are an expert educational content creator. Analyze the provided content and generate an engaging quiz title, description, and appropriate time limit.

CRITICAL RULES:
- Create a specific, engaging title that reflects the topic/content
- Write a clear description explaining what the quiz covers
- Time will be calculated automatically based on question count (2 minutes per question)
- Use appropriate terminology for the subject matter
- Make it sound professional and educational

Format your response as JSON with this exact structure:
{
  "title": "Specific, engaging title based on the content",
  "description": "Clear description of what the quiz covers and its educational value",
  "recommendedTime": 15
}`
        : `You are an expert educational content creator. Analyze the provided medical content and generate an engaging quiz title, description, and appropriate time limit.

CRITICAL RULES:
- Create a specific, engaging title that reflects the medical topic/content
- Write a clear description explaining what the quiz covers
- Time will be calculated automatically based on question count (2 minutes per question)
- Use medical terminology appropriately
- Make it sound professional and educational

Format your response as JSON with this exact structure:
{
  "title": "Specific, engaging title based on the medical content",
  "description": "Clear description of what the quiz covers and its educational value",
  "recommendedTime": 15
}`;

      const userPrompt = isNonMedical
        ? `CONTENT SAMPLE (${totalTextLength} total characters):
${firstChunk}

Generate an engaging title and description for a quiz based on this content. Time will be calculated automatically based on the number of questions generated.`
        : `MEDICAL CONTENT SAMPLE (${totalTextLength} total characters):
${firstChunk}

Generate an engaging title and description for a quiz based on this medical content. Time will be calculated automatically based on the number of questions generated.`;

      const response = await fetchAI(
        [{ role: 'user', content: userPrompt }],
        {
          systemPrompt,
          temperature: 0.3,
          maxTokens: 500,
          responseFormat: 'json'
        }
      );

      let parsedResponse: {
        title?: string;
        description?: string;
        recommendedTime?: number;
      };

      try {
        parsedResponse = parseAIResponse(response.content);
      } catch (parseError) {
        console.warn('Failed to parse title/description response, using fallback');
        parsedResponse = {};
      }

      // Time will be calculated based on actual question count (2 minutes per question)
      // This is just a placeholder - actual time will be calculated after questions are generated
      const calculatedTime = 15; // Default fallback

      return {
        title: parsedResponse.title || (isNonMedical ? 'Knowledge Quiz' : 'Medical Knowledge Quiz'),
        description: parsedResponse.description || (isNonMedical ? 'Test your understanding of the concepts with this comprehensive quiz.' : 'Test your understanding of medical concepts with this comprehensive quiz.'),
        recommendedTime: calculatedTime
      };
    } catch (error) {
      console.error('Failed to generate title and description:', error);
      // Fallback values - time will be calculated based on question count
      return {
        title: isNonMedical ? 'Knowledge Quiz' : 'Medical Knowledge Quiz',
        description: isNonMedical ? 'Test your understanding of the concepts with this comprehensive quiz.' : 'Test your understanding of medical concepts with this comprehensive quiz.',
        recommendedTime: 15 // Will be recalculated based on actual question count
      };
    }
  }, [parseAIResponse]);

  /**
   * Removes duplicate questions based on similarity of question text
   */
  const removeDuplicateQuestions = useCallback((questions: QuizQuestion[]): QuizQuestion[] => {
    const uniqueQuestions: QuizQuestion[] = [];
    const seenQuestions = new Set<string>();

    for (const question of questions) {
      // Normalize question text for comparison
      const normalizedText = question.question
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

      // Check if we've seen a similar question
      let isDuplicate = false;
      for (const seen of seenQuestions) {
        // Simple similarity check - if 80% of words match, consider it duplicate
        const words1 = normalizedText.split(' ');
        const words2 = seen.split(' ');
        const commonWords = words1.filter(word => words2.includes(word));
        const similarity = commonWords.length / Math.max(words1.length, words2.length);
        
        if (similarity > 0.8) {
          isDuplicate = true;
          break;
        }
      }

      if (!isDuplicate) {
        seenQuestions.add(normalizedText);
        uniqueQuestions.push(question);
      }
    }

    return uniqueQuestions;
  }, []);

  const generateQuizQuestions = useCallback(async (
    data: QuizCreationData
  ): Promise<QuizGenerationResult> => {
    const isNonMedical = data.isNonMedical || false;
    setIsGenerating(true);
    setError(null);

    try {
      let sourceText: string;

      // Extract text from PDF or use provided text
      let extractionMethod: 'pdfjs' | 'ocr' | undefined;
      if (data.sourceType === 'pdf' && data.pdfFile) {
        setProgress({
          stage: 'extracting',
          message: 'Extracting text from PDF...',
          progress: 10
        });
        const pdfResult = await extractTextFromPDF(data.pdfFile);
        if (!pdfResult.success) {
          return {
            success: false,
            error: 'error' in pdfResult ? pdfResult.error : 'Failed to extract text from PDF'
          };
        }
        sourceText = pdfResult.text;
        extractionMethod = pdfResult.method;
      } else {
        setProgress({
          stage: 'analyzing',
          message: 'Processing source text...',
          progress: 20
        });
        sourceText = data.source;
        console.log(`Processing text input: ${sourceText.length} characters`);
      }

      if (!sourceText.trim()) {
        return {
          success: false,
          error: 'No source material provided'
        };
      }

      // Check if we need to process in chunks
      setProgress({
        stage: 'analyzing',
        message: 'Analyzing content structure...',
        progress: 30
      });
      
      const chunks = splitTextIntoChunks(sourceText, maxChunkSize);
        console.log(`Text length: ${sourceText.length} characters, split into ${chunks.length} chunks`);
        console.log(`Max chunk size: ${maxChunkSize}, Questions per chunk: ${questionsPerChunk}`);
      
      if (chunks.length === 1) {
        setProgress({
          stage: 'generating',
          message: 'Generating questions with AI...',
          progress: 50
        });
        // Single chunk - process normally but generate more questions
        const questionsToGenerate = Math.max(questionCount, 15); // Generate at least 15 questions for single chunks
        console.log(`Single chunk processing: generating ${questionsToGenerate} questions`);
        const systemPrompt = isNonMedical 
          ? `Create ${questionsToGenerate} multiple-choice questions from the source material.

Rules:
- 4 options per question (A, B, C, D)
- Test different concepts, no duplicates
- Clear, unambiguous questions
- One correct answer per question
- Include title, description, and questions in JSON format

JSON format:
{
  "title": "Quiz Title",
  "description": "Quiz description",
  "recommendedTime": 15,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why A is correct",
      "points": 1
    }
  ]
}`
          : `Create ${questionsToGenerate} medical multiple-choice questions from the source material.

Rules:
- 4 options per question (A, B, C, D)
- Test different medical concepts, no duplicates
- Use appropriate medical terminology
- Clear, unambiguous questions
- One correct answer per question
- Include title, description, and questions in JSON format

JSON format:
{
  "title": "Medical Quiz Title",
  "description": "Quiz description",
  "recommendedTime": 15,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why A is correct",
      "points": 1
    }
  ]
}`;

        const userPrompt = isNonMedical
          ? `Source: ${sourceText}

Create ${questionsToGenerate} questions covering key concepts.`
          : `Medical source: ${sourceText}

Create ${questionsToGenerate} medical questions covering key concepts.`;

        const response = await fetchAI(
          [{ role: 'user', content: userPrompt }],
          {
            systemPrompt,
            temperature,
            maxTokens,
            responseFormat: 'json'
          }
        );

        // Parse the JSON response for single chunk using robust parser
        let parsedResponse: { 
          title?: string;
          description?: string;
          recommendedTime?: number;
          questions?: Array<{
            id?: string;
            question?: string;
            options?: string[];
            correctAnswer?: string;
            explanation?: string;
            points?: number;
          }> 
        };
        try {
          parsedResponse = parseAIResponse(response.content);
        } catch (parseError) {
          console.error('Failed to parse AI response:', parseError);
          console.error('Response content:', response.content);
          throw new Error(`Failed to parse AI response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }

        // Validate and format questions
        const questions: QuizQuestion[] = [];
        if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
          for (let i = 0; i < parsedResponse.questions.length; i++) {
            const q = parsedResponse.questions[i];
            // More flexible validation - allow 3-6 options instead of exactly 4
            if (q.question && q.options && Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 6 && q.correctAnswer) {
              questions.push({
                id: q.id || `q_${i + 1}`,
                question: q.question.trim(),
                options: q.options.map(opt => String(opt).trim()),
                correctAnswer: String(q.correctAnswer).trim(),
                explanation: q.explanation ? String(q.explanation).trim() : '',
                points: typeof q.points === 'number' ? q.points : 1
              });
            } else {
              console.warn(`Skipping invalid question ${i + 1}:`, q);
            }
          }
        }

        if (questions.length === 0) {
          return {
            success: false,
            error: 'No valid questions were generated'
          };
        }

        setProgress({
          stage: 'finalizing',
          message: 'Finalizing quiz details...',
          progress: 90
        });

        // Calculate time based on question count (2 minutes per question)
        const calculatedTime = Math.max(5, questions.length * 2); // Minimum 5 minutes, 2 minutes per question

        console.log(`Single chunk result: ${questions.length} questions generated`);
        return {
          success: true,
          questions,
          title: parsedResponse.title || (isNonMedical ? 'Knowledge Quiz' : 'Medical Knowledge Quiz'),
          description: parsedResponse.description || (isNonMedical ? 'Test your understanding of the concepts with this comprehensive quiz.' : 'Test your understanding of medical concepts with this comprehensive quiz.'),
          recommendedTime: calculatedTime,
          sourceText,
          extractionMethod: extractionMethod
        };
      } else {
        // Multiple chunks - process each chunk and combine results
        const allQuestions: QuizQuestion[] = [];
        
        setProgress({
          stage: 'generating',
          message: 'Generating questions with AI...',
          progress: 50
        });

        // Generate title and description from the first chunk
        console.log('Generating title and description from first chunk...');
        const titleDescriptionResult = await generateTitleAndDescription(chunks[0], sourceText.length, isNonMedical);
        const quizTitle = titleDescriptionResult.title;
        const quizDescription = titleDescriptionResult.description;
        const recommendedTime = titleDescriptionResult.recommendedTime;

        // Process chunks in parallel for better performance
        const chunkPromises = chunks.map(async (chunk, i) => {
          console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.length} characters)`);

          const systemPrompt = isNonMedical
            ? `Create ${questionsPerChunk} multiple-choice questions from the text.

Rules:
- 4 options per question (A, B, C, D)
- Test different concepts, no duplicates
- Clear, unambiguous questions
- One correct answer per question

JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why A is correct",
      "points": 1
    }
  ]
}`
            : `Create ${questionsPerChunk} medical multiple-choice questions from the text.

Rules:
- 4 options per question (A, B, C, D)
- Test different medical concepts, no duplicates
- Use appropriate medical terminology
- Clear, unambiguous questions
- One correct answer per question

JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why A is correct",
      "points": 1
    }
  ]
}`;

          const userPrompt = isNonMedical
            ? `Text: ${chunk}

Create ${questionsPerChunk} questions covering key concepts.`
            : `Medical text: ${chunk}

Create ${questionsPerChunk} medical questions covering key concepts.`;

          try {
            const response = await fetchAI(
              [{ role: 'user', content: userPrompt }],
              {
                systemPrompt,
                temperature,
                maxTokens,
                responseFormat: 'json'
              }
            );

            // Parse the JSON response for this chunk
            let parsedResponse: { 
              questions?: Array<{
                id?: string;
                question?: string;
                options?: string[];
                correctAnswer?: string;
                explanation?: string;
                points?: number;
              }> 
            };
            
            try {
              parsedResponse = parseAIResponse(response.content);
            } catch (parseError) {
              console.error(`Failed to parse response for chunk ${i + 1}:`, parseError);
              return [];
            }

            // Validate and format questions from this chunk
            const chunkQuestions: QuizQuestion[] = [];
            if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
              for (let j = 0; j < parsedResponse.questions.length; j++) {
                const q = parsedResponse.questions[j];
                if (q.question && q.options && Array.isArray(q.options) && q.options.length >= 3 && q.options.length <= 6 && q.correctAnswer) {
                  chunkQuestions.push({
                    id: q.id || `q_${i + 1}_${j + 1}`,
                    question: q.question.trim(),
                    options: q.options.map(opt => String(opt).trim()),
                    correctAnswer: String(q.correctAnswer).trim(),
                    explanation: q.explanation ? String(q.explanation).trim() : '',
                    points: typeof q.points === 'number' ? q.points : 1
                  });
                }
              }
            }
            
            return chunkQuestions;
          } catch (error) {
            console.error(`Error processing chunk ${i + 1}:`, error);
            return [];
          }
        });

        // Wait for all chunks to process in parallel
        const chunkResults = await Promise.all(chunkPromises);
        
        setProgress({
          stage: 'finalizing',
          message: 'Finalizing quiz details...',
          progress: 90
        });
        
        // Flatten all questions from all chunks
        for (const chunkQuestions of chunkResults) {
          allQuestions.push(...chunkQuestions);
        }

        // Remove duplicates - for chunked processing, return ALL unique questions
        const uniqueQuestions = removeDuplicateQuestions(allQuestions);
        
        console.log(`Generated ${allQuestions.length} total questions, ${uniqueQuestions.length} unique after deduplication, returning ${uniqueQuestions.length}`);

        if (uniqueQuestions.length === 0) {
          return {
            success: false,
            error: 'No valid questions were generated'
          };
        }

        // Calculate time based on final question count (2 minutes per question)
        const finalCalculatedTime = Math.max(5, uniqueQuestions.length * 2); // Minimum 5 minutes, 2 minutes per question

        return {
          success: true,
          questions: uniqueQuestions,
          title: quizTitle,
          description: quizDescription,
          recommendedTime: finalCalculatedTime,
          sourceText,
          extractionMethod: extractionMethod
        };
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate quiz questions';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsGenerating(false);
    }
  }, [temperature, maxTokens, questionCount, maxChunkSize, questionsPerChunk, removeDuplicateQuestions, parseAIResponse, generateTitleAndDescription]);

  return {
    generateQuizQuestions,
    isGenerating,
    error,
    progress
  };
}
