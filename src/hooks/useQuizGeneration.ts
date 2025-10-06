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
    maxTokens = 4000, // Increased token limit for better responses
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

    // Strategy 4: Try to fix common JSON issues and handle truncation
    let cleanedContent = responseContent
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .replace(/^\s*```\s*$/gm, '')
      .trim();

    // Fix trailing commas
    cleanedContent = cleanedContent.replace(/,(\s*[}\]])/g, '$1');
    
    // Fix unescaped quotes in strings
    cleanedContent = cleanedContent.replace(/"([^"]*)"([^"]*)"([^"]*)":/g, '"$1\\"$2\\"$3":');

    // Strategy 5: Handle truncated JSON by attempting to complete it
    if (cleanedContent.includes('"correct') && !cleanedContent.endsWith('}')) {
      // Try to find the last complete question and truncate there
      const lastCompleteQuestion = cleanedContent.lastIndexOf('},');
      if (lastCompleteQuestion > 0) {
        cleanedContent = cleanedContent.substring(0, lastCompleteQuestion + 1) + ']';
        // Try to close the JSON structure
        if (cleanedContent.includes('"questions": [')) {
          const questionsStart = cleanedContent.indexOf('"questions": [');
          const beforeQuestions = cleanedContent.substring(0, questionsStart);
          const questionsPart = cleanedContent.substring(questionsStart);
          const lastCompleteQuestionInPart = questionsPart.lastIndexOf('},');
          if (lastCompleteQuestionInPart > 0) {
            cleanedContent = beforeQuestions + questionsPart.substring(0, lastCompleteQuestionInPart + 1) + ']}';
          }
        }
      }
    }

    try {
      return JSON.parse(cleanedContent);
    } catch (e) {
      console.warn('Cleaned JSON parse failed');
    }

    // Strategy 6: Try to extract questions array directly
    const questionsMatch = responseContent.match(/questions\s*:\s*\[([\s\S]*?)\]/);
    if (questionsMatch) {
      try {
        const questionsArray = JSON.parse(`[${questionsMatch[1]}]`);
        return { questions: questionsArray };
      } catch (e) {
        console.warn('Questions array extraction failed');
      }
    }

    // Strategy 7: Handle truncated JSON by attempting to reconstruct it
    if (responseContent.includes('"questions": [') && responseContent.includes('"correct')) {
      try {
        // Extract the questions array even if truncated
        const questionsStart = responseContent.indexOf('"questions": [');
        const questionsEnd = responseContent.lastIndexOf('}');
        
        if (questionsStart !== -1 && questionsEnd !== -1) {
          const questionsPart = responseContent.substring(questionsStart + 13, questionsEnd + 1);
          
          // Try to find complete question objects by counting braces
          const questions = [];
          let braceCount = 0;
          let currentQuestion = '';
          let inString = false;
          let escapeNext = false;
          
          for (let i = 0; i < questionsPart.length; i++) {
            const char = questionsPart[i];
            
            if (escapeNext) {
              escapeNext = false;
              currentQuestion += char;
              continue;
            }
            
            if (char === '\\') {
              escapeNext = true;
              currentQuestion += char;
              continue;
            }
            
            if (char === '"' && !escapeNext) {
              inString = !inString;
            }
            
            if (!inString) {
              if (char === '{') {
                braceCount++;
              } else if (char === '}') {
                braceCount--;
              }
            }
            
            currentQuestion += char;
            
            // If we've closed a complete question object
            if (braceCount === 0 && currentQuestion.trim().startsWith('{')) {
              try {
                const parsed = JSON.parse(currentQuestion.trim());
                if (parsed.id && parsed.question && parsed.options && parsed.correctAnswer) {
                  questions.push(parsed);
                }
              } catch (e) {
                // Skip malformed questions
              }
              currentQuestion = '';
            }
          }
          
          if (questions.length > 0) {
            return { questions };
          }
        }
      } catch (e) {
        console.warn('Truncated JSON reconstruction failed');
      }
    }

    throw new Error(`Failed to parse AI response. Content preview: ${responseContent.substring(0, 200)}...`);
  }, []);

  /**
   * Normalize various forms of correctAnswer into a single uppercase letter (A-F)
   * Ensures the letter maps to an existing option index
   */
  const normalizeCorrectAnswer = useCallback((rawCorrect: unknown, options: unknown[]): string | null => {
    if (!rawCorrect || !Array.isArray(options) || options.length === 0) return null;

    const text = String(rawCorrect).trim();

    // 1) Direct letter (A-F)
    const directLetterMatch = text.match(/^([A-Fa-f])\b/);
    if (directLetterMatch) {
      const letter = directLetterMatch[1].toUpperCase();
      const idx = letter.charCodeAt(0) - 65; // A->0
      return idx >= 0 && idx < options.length ? letter : null;
    }

    // 2) Number 1-6 (1-based)
    const numberMatch = text.match(/^(?:Option\s*)?(\d)\b/gi);
    if (numberMatch) {
      const num = parseInt(numberMatch[0].replace(/[^0-9]/g, ''), 10);
      if (!Number.isNaN(num)) {
        const idx = num - 1;
        if (idx >= 0 && idx < options.length) {
          return String.fromCharCode(65 + idx);
        }
      }
    }

    // 3) Patterns like "Option B", "option c)"
    const optionLetterMatch = text.match(/^option\s*([A-Fa-f])\b\)?/i);
    if (optionLetterMatch) {
      const letter = optionLetterMatch[1].toUpperCase();
      const idx = letter.charCodeAt(0) - 65;
      return idx >= 0 && idx < options.length ? letter : null;
    }

    // 4) Patterns like "B)" or "b."
    const prefixedLetterMatch = text.match(/^([A-Fa-f])[).]?/);
    if (prefixedLetterMatch) {
      const letter = prefixedLetterMatch[1].toUpperCase();
      const idx = letter.charCodeAt(0) - 65;
      return idx >= 0 && idx < options.length ? letter : null;
    }

    // 5) Exact option text match -> map to index
    const normalizedOptions = options.map(o => String(o).trim());
    const byExactTextIdx = normalizedOptions.findIndex(o => o === text);
    if (byExactTextIdx >= 0) {
      return String.fromCharCode(65 + byExactTextIdx);
    }

    // 6) Case-insensitive contains (best-effort, avoid if ambiguous)
    const lowerText = text.toLowerCase();
    const candidates = normalizedOptions
      .map((o, i) => ({ i, o: o.toLowerCase() }))
      .filter(({ o }) => o === lowerText || o.includes(lowerText));
    if (candidates.length === 1) {
      return String.fromCharCode(65 + candidates[0].i);
    }

    return null;
  }, []);

  /**
   * Sanitize options by stripping any leading labels like "A)", "B.", "1)" etc.
   */
  const sanitizeOptions = useCallback((options: unknown[]): string[] => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) => {
      const text = String(opt);
      // Remove leading patterns: "A) ", "A. ", "A - ", "1) ", "1. "
      return text.replace(/^\s*([A-Fa-f]|\d{1,2})[).-]\s+/, '').trim();
    });
  }, []);

  // Ensure each question has a unique sequential id for consistent mapping
  const assignSequentialIds = useCallback((questions: QuizQuestion[]): QuizQuestion[] => {
    return questions.map((q, idx) => ({ ...q, id: `q_${idx + 1}` }));
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

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

Rules:
- 4 options per question (A, B, C, D)
- Test different concepts, no duplicates
- Clear, unambiguous questions
- One correct answer per question
- correctAnswer MUST be a single uppercase letter among A, B, C, or D
- The options array MUST contain only the option texts, without any leading letters (no "A)" / "B." prefixes)
- Keep explanations concise to avoid truncation
- Respond with ONLY the JSON object below

{
  "title": "Quiz Title",
  "description": "Quiz description", 
  "recommendedTime": 15,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A",
      "explanation": "Brief explanation",
      "points": 1
    }
  ]
}`
          : `Create ${questionsToGenerate} medical multiple-choice questions from the source material.

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

Rules:
- 4 options per question (A, B, C, D)
- Test different medical concepts, no duplicates
- Use appropriate medical terminology
- Clear, unambiguous questions
- One correct answer per question
- correctAnswer MUST be a single uppercase letter among A, B, C, or D
- The options array MUST contain only the option texts, without any leading letters (no "A)" / "B." prefixes)
- Keep explanations concise to avoid truncation
- Respond with ONLY the JSON object below

{
  "title": "Medical Quiz Title",
  "description": "Quiz description",
  "recommendedTime": 15,
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "A",
      "explanation": "Brief explanation",
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
              // Clean options and normalize correct answer against them
              const cleanedOptions = sanitizeOptions(q.options);
              const normalizedLetter = normalizeCorrectAnswer(q.correctAnswer, cleanedOptions);
              if (normalizedLetter) {
                questions.push({
                  id: q.id || `q_${i + 1}`,
                  question: q.question.trim(),
                  options: cleanedOptions,
                  correctAnswer: normalizedLetter,
                  explanation: q.explanation ? String(q.explanation).trim() : '',
                  points: typeof q.points === 'number' ? q.points : 1
                });
              } else {
                console.warn(`Invalid correctAnswer for question ${i + 1}:`, {
                  correctAnswer: q.correctAnswer,
                  options: cleanedOptions,
                  question: q
                });
              }
            } else {
              console.warn(`Skipping invalid question ${i + 1}:`, {
                hasQuestion: !!q.question,
                hasOptions: !!q.options,
                optionsLength: q.options?.length,
                hasCorrectAnswer: !!q.correctAnswer,
                correctAnswerValue: q.correctAnswer,
                question: q
              });
            }
          }
        }

        if (questions.length === 0) {
          return {
            success: false,
            error: 'No valid questions were generated'
          };
        }

        // Reassign sequential unique IDs to avoid collisions
        const finalQuestions = assignSequentialIds(questions);

        setProgress({
          stage: 'finalizing',
          message: 'Finalizing quiz details...',
          progress: 90
        });

        // Calculate time based on question count (2 minutes per question)
        const calculatedTime = Math.max(5, finalQuestions.length * 2); // Minimum 5 minutes, 2 minutes per question

        console.log(`Single chunk result: ${finalQuestions.length} questions generated`);
        return {
          success: true,
          questions: finalQuestions,
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

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

Rules:
- 4 options per question (A, B, C, D)
- Test different concepts, no duplicates
- Clear, unambiguous questions
- One correct answer per question
- correctAnswer MUST be a single uppercase letter among A, B, C, or D
- The options array MUST contain only the option texts, without any leading letters (no "A)" / "B." prefixes)

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

CRITICAL: You MUST respond with valid JSON only. No additional text before or after the JSON.

Rules:
- 4 options per question (A, B, C, D)
- Test different medical concepts, no duplicates
- Use appropriate medical terminology
- Clear, unambiguous questions
- One correct answer per question
- correctAnswer MUST be a single uppercase letter among A, B, C, or D
- The options array MUST contain only the option texts, without any leading letters (no "A)" / "B." prefixes)

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
                  // Clean options and normalize answer
                  const cleanedOptions = sanitizeOptions(q.options);
                  const normalizedLetter = normalizeCorrectAnswer(q.correctAnswer, cleanedOptions);
                  if (normalizedLetter) {
                    chunkQuestions.push({
                      id: q.id || `q_${i + 1}_${j + 1}`,
                      question: q.question.trim(),
                      options: cleanedOptions,
                      correctAnswer: normalizedLetter, // Always uppercase letter aligned to options
                      explanation: q.explanation ? String(q.explanation).trim() : '',
                      points: typeof q.points === 'number' ? q.points : 1
                    });
                  } else {
                    console.warn(`Invalid correctAnswer for chunk question ${i + 1}_${j + 1}:`, {
                      correctAnswer: q.correctAnswer,
                      options: cleanedOptions,
                      question: q
                    });
                  }
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

        // Assign sequential IDs after deduplication to avoid collisions from model-provided IDs
        const finalQuestions = assignSequentialIds(uniqueQuestions);

        // Calculate time based on final question count (2 minutes per question)
        const finalCalculatedTime = Math.max(5, finalQuestions.length * 2); // Minimum 5 minutes, 2 minutes per question

        return {
          success: true,
          questions: finalQuestions,
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
  }, [temperature, maxTokens, questionCount, maxChunkSize, questionsPerChunk, removeDuplicateQuestions, parseAIResponse, generateTitleAndDescription, sanitizeOptions, normalizeCorrectAnswer, assignSequentialIds]);

  return {
    generateQuizQuestions,
    isGenerating,
    error,
    progress
  };
}
