
import { useCallback, useMemo, useState } from 'react'
import { extractTextFromPDF, ExtractResult, splitTextIntoChunks } from '@/services/pdf'
import { fetchAI, type AIMessage } from '@/utils/geminiConfig'

type PdfAiTask = 'extract-questions' | 'extract-course-info'

interface UsePdfAiOptions {
	model?: string
	temperature?: number
	maxOutputTokens?: number
	maxChunkSize?: number
	questionsPerChunk?: number
}

interface FileInfo {
	name: string
	size: number
	type: string
	pageCount: number
}

interface BaseSuccess<T> {
	success: true
	data: T
	extractedText?: string
	fileInfo?: FileInfo
	method?: 'pdfjs' | 'ocr'
}

interface BaseError {
	success: false
	error: string
	stage?: 'extraction' | 'ai'
	fileInfo?: FileInfo
	rawResponse?: string
}

export type PdfAiResult<T> = BaseSuccess<T> | BaseError

export type ExtractedQuestion = {
	id: string
	question_text: string
	question_type: 'mcq' | 'written'
	options?: string[]
	correct_answer?: string
	points?: number
}

export type CourseInfo = {
	title?: string
	description?: string
	category?: string
	price?: number
	instructor?: string
	chapters?: Array<{
		title: string
		description?: string
		lessons?: Array<{ title: string; duration_minutes?: number }>
	}>
}

function buildPrompt(task: PdfAiTask, text: string, questionsPerChunk: number = 8) {
	if (task === 'extract-questions') {
		const system = `You are an expert educational content parser specializing in medical education. Extract comprehensive quiz questions from the provided text.

CRITICAL RULES:
- Generate EXACTLY ${questionsPerChunk} high-quality questions from this text segment
- Create questions on EVERY important concept, definition, process, and detail mentioned
- NO DUPLICATE questions - each question must test a different concept
- Cover ALL topics: definitions, procedures, symptoms, treatments, anatomy, physiology, pharmacology, etc.
- For MCQ: provide exactly 4 options (A, B, C, D) with only ONE correct answer
- Make incorrect options plausible but clearly distinguishable from the correct answer
- Questions should test understanding, application, and critical thinking, not just memorization
- Use precise medical terminology appropriately
- Ensure questions are challenging but fair for medical students
- If a correct answer is present in the text, use the exact wording
- Return ONLY JSON with the specified schema`

		const schema = {
			questions: [
				{
					id: 'string',
					question_text: 'string',
					question_type: "'mcq' | 'written'",
					options: ['string?'],
					correct_answer: 'string?',
					points: 'number?'
				}
			]
		}

		const user = `MEDICAL TEXT SEGMENT:\n\n${text}\n\nExtract EXACTLY ${questionsPerChunk} comprehensive questions covering ALL concepts in this segment. Focus on different aspects: definitions, clinical applications, mechanisms, symptoms, treatments, anatomy, etc. Return JSON only with shape: ${JSON.stringify(schema)}`
		return { system, user }
	}

	const system = `You are an expert course information extractor. Parse course metadata, chapters, and lessons from text.

Rules:
- Provide best-effort fields: title, description, category, price, instructor
- Aggregate chapters with lessons when present
- Use numbers for price when explicit, otherwise omit
- Return ONLY JSON with the specified schema`

	const schema = {
		course: {
			title: 'string?',
			description: 'string?',
			category: 'string?',
			price: 'number?',
			instructor: 'string?',
			chapters: [
				{
					title: 'string',
					description: 'string?',
					lessons: [
						{ title: 'string', duration_minutes: 'number?' }
					]
				}
			]
		}
	}

	const user = `Source text:\n\n${text}\n\nReturn JSON only with shape: ${JSON.stringify(schema)}`
	return { system, user }
}

/**
 * Removes duplicate questions based on similarity of question text
 */
function removeDuplicateQuestions(questions: ExtractedQuestion[]): ExtractedQuestion[] {
	const uniqueQuestions: ExtractedQuestion[] = [];
	const seenQuestions = new Set<string>();

	for (const question of questions) {
		// Normalize question text for comparison
		const normalizedText = question.question_text
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
}

async function callGeminiJSON(system: string, user: string, opts?: UsePdfAiOptions) {
	const temperature = opts?.temperature ?? 0.2
	const maxOutputTokens = opts?.maxOutputTokens ?? 2000

	const messages: AIMessage[] = [
		{ role: 'user', content: user }
	]

	const response = await fetchAI(messages, {
		systemPrompt: system,
		temperature,
		maxTokens: maxOutputTokens,
		responseFormat: 'json'
	})

	return response.content
}

export function usePdfAi(task: PdfAiTask, options?: UsePdfAiOptions) {
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const schemaGuard = useMemo(() => {
		return {
			parseQuestions(json: unknown): ExtractedQuestion[] {
				const data = json as Record<string, unknown>;
				const list = data?.questions;
				if (!Array.isArray(list)) return [];
				return list
					.map((q: unknown) => {
						const question = q as Record<string, unknown>;
						return {
							id: String(question.id ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)),
							question_text: String(question.question_text ?? ''),
							question_type: (question.question_type === 'mcq' ? 'mcq' : 'written') as 'mcq' | 'written',
							options: Array.isArray(question.options) ? question.options.map((o: unknown) => String(o)) : undefined,
							correct_answer: question.correct_answer ? String(question.correct_answer) : undefined,
							points: typeof question.points === 'number' ? question.points : undefined,
						};
					})
					.filter((q) => q.question_text);
			},
			parseCourse(json: unknown): CourseInfo {
				const data = json as Record<string, unknown>;
				const c = data?.course ?? data;
				const courseData = c as Record<string, unknown>;
				const chaptersIn = Array.isArray(courseData?.chapters) ? courseData.chapters : [];
				return {
					title: courseData?.title ? String(courseData.title) : undefined,
					description: courseData?.description ? String(courseData.description) : undefined,
					category: courseData?.category ? String(courseData.category) : undefined,
					price: typeof courseData?.price === 'number' ? courseData.price : undefined,
					instructor: courseData?.instructor ? String(courseData.instructor) : undefined,
					chapters: chaptersIn
						.map((ch: unknown) => {
							const chapter = ch as Record<string, unknown>;
							return {
								title: String(chapter?.title ?? ''),
								description: chapter?.description ? String(chapter.description) : undefined,
								lessons: Array.isArray(chapter?.lessons)
									? chapter.lessons.map((ls: unknown) => {
											const lesson = ls as Record<string, unknown>;
											return {
												title: String(lesson?.title ?? ''),
												duration_minutes:
													typeof lesson?.duration_minutes === 'number' ? lesson.duration_minutes : undefined,
											};
									  })
									: undefined,
							};
						})
						.filter((ch: Record<string, unknown>) => ch.title),
				};
			},
		}
	}, [])

	const process = useCallback(
		async (
			input:
				| { pdfFile: File; rawText?: undefined }
				| { pdfFile?: undefined; rawText: string }
		): Promise<PdfAiResult<ExtractedQuestion[] | CourseInfo>> => {
			setLoading(true)
			setError(null)
			try {
				let text: string
				let fileInfo: FileInfo | undefined
				if ('pdfFile' in input && input.pdfFile) {
					const res = await extractTextFromPDF(input.pdfFile)
					if (!res.success) {
						return { 
							success: false, 
							error: 'PDF extraction failed', 
							stage: 'extraction' as const,
							fileInfo: undefined
						}
					}
					text = res.text
					fileInfo = res.fileInfo
				} else {
					text = input.rawText
				}

				// For question extraction, process in chunks if text is large
				if (task === 'extract-questions') {
					const maxChunkSize = options?.maxChunkSize ?? 8000
					const questionsPerChunk = options?.questionsPerChunk ?? 8
					
					// Split text into chunks if it's large
					const chunks = splitTextIntoChunks(text, maxChunkSize)
					
					if (chunks.length === 1) {
						// Single chunk - process normally
						const { system, user } = buildPrompt(task, text, questionsPerChunk)
						const responseText = await callGeminiJSON(system, user, options)
						let parsed: unknown
						try {
							parsed = JSON.parse(responseText)
						} catch (_e) {
							const match = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
							if (!match) throw new Error('Failed to parse AI response as JSON')
							parsed = JSON.parse(match[0])
						}
						
					const questions = schemaGuard.parseQuestions(parsed)
					return { success: true, data: questions, extractedText: text, fileInfo, method: res.method }
					} else {
						// Multiple chunks - process each chunk and combine results
						const allQuestions: ExtractedQuestion[] = []
						
						for (let i = 0; i < chunks.length; i++) {
							const chunk = chunks[i]
							console.log(`Processing chunk ${i + 1}/${chunks.length} (${chunk.length} characters)`)
							
							const { system, user } = buildPrompt(task, chunk, questionsPerChunk)
							const responseText = await callGeminiJSON(system, user, options)
							let parsed: unknown
							try {
								parsed = JSON.parse(responseText)
							} catch (_e) {
								const match = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
								if (!match) {
									console.warn(`Failed to parse response for chunk ${i + 1}, skipping`)
									continue
								}
								parsed = JSON.parse(match[0])
							}
							
							const chunkQuestions = schemaGuard.parseQuestions(parsed)
							allQuestions.push(...chunkQuestions)
							
							// Add small delay between API calls to avoid rate limiting
							if (i < chunks.length - 1) {
								await new Promise(resolve => setTimeout(resolve, 1000))
							}
						}
						
						// Remove duplicates and return combined results
						const uniqueQuestions = removeDuplicateQuestions(allQuestions)
						console.log(`Generated ${allQuestions.length} total questions, ${uniqueQuestions.length} unique after deduplication`)
						
						return { success: true, data: uniqueQuestions, extractedText: text, fileInfo, method: res.method }
					}
				} else {
					// For course info extraction, process normally
					const { system, user } = buildPrompt(task, text)
					const responseText = await callGeminiJSON(system, user, options)
					let parsed: unknown
					try {
						parsed = JSON.parse(responseText)
					} catch (_e) {
						const match = responseText.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
						if (!match) throw new Error('Failed to parse AI response as JSON')
						parsed = JSON.parse(match[0])
					}

					const course = schemaGuard.parseCourse(parsed)
					return { success: true, data: course, extractedText: text, fileInfo, method: res.method }
				}
			} catch (e: unknown) {
				const errorMessage = e instanceof Error ? e.message : 'Processing failed';
				setError(errorMessage);
				return { success: false, error: errorMessage, stage: 'ai' as const }
			} finally {
				setLoading(false)
			}
		},
		[options, schemaGuard, task]
	)

	return {
		loading,
		error,
		process,
	}
}
