import * as pdfjsLib from 'pdfjs-dist'
// Vite: import worker URL that can be served correctly in dev/build
// If you prefer a static public file, set VITE_PDFJS_WORKER_SRC to "/pdfjs/pdf.worker.js"
// or use a CDN URL (e.g., https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js)
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - Vite query import provides string URL at runtime
import defaultWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

// Dynamic import for Tesseract.js to avoid build issues
let Tesseract: any = null;

/**
 * Dynamically loads Tesseract.js to avoid build issues
 */
async function loadTesseract() {
	if (!Tesseract) {
		try {
			const tesseractModule = await import('tesseract.js');
			Tesseract = tesseractModule.default || tesseractModule;
		} catch (error) {
			console.error('Failed to load Tesseract.js:', error);
			throw new Error('OCR functionality is not available');
		}
	}
	return Tesseract;
}

// Ensure the PDF.js worker is configured once per app lifecycle
// This expects the worker file to be served at /pdfjs/pdf.worker.js
// See docs/README_PDF_TEXT_EXTRACTION.md for setup instructions
if (typeof window !== 'undefined') {
	const envWorker = (import.meta as { env?: { VITE_PDFJS_WORKER_SRC?: string } })?.env?.VITE_PDFJS_WORKER_SRC
	const workerUrl = envWorker && envWorker.trim().length > 0 ? envWorker : (defaultWorkerUrl as string)
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (pdfjsLib as any).GlobalWorkerOptions.workerSrc = workerUrl
    } catch {
		// noop – pdf.js may set up a fake worker if needed, but we aim to avoid that scenario
	}
}

export type ExtractResult =
	| {
				success: true
				text: string
				fileInfo: { name: string; size: number; type: string; pageCount: number }
				method: 'pdfjs' | 'ocr'
		  }
	| {
				success: false
				error: string
				fileInfo?: { name?: string; size?: number; type?: string; pageCount?: number }
		  }

/**
 * Converts a PDF page to a canvas image for OCR processing
 */
async function pdfPageToCanvas(page: pdfjsLib.PDFPageProxy, scale: number = 2): Promise<HTMLCanvasElement> {
	const viewport = page.getViewport({ scale })
	const canvas = document.createElement('canvas')
	const context = canvas.getContext('2d')
	
	if (!context) {
		throw new Error('Failed to get canvas context')
	}
	
	canvas.height = viewport.height
	canvas.width = viewport.width
	
	const renderContext = {
		canvasContext: context,
		viewport: viewport,
		canvas: canvas,
	}
	
	await page.render(renderContext).promise
	return canvas
}

/**
 * Extracts text from a canvas using OCR
 */
async function extractTextFromCanvas(canvas: HTMLCanvasElement): Promise<string> {
	try {
		// Convert canvas to blob
		const blob = await new Promise<Blob>((resolve, reject) => {
			canvas.toBlob((blob) => {
				if (blob) {
					resolve(blob)
				} else {
					reject(new Error('Failed to convert canvas to blob'))
				}
			}, 'image/png')
		})
		
		// Load Tesseract.js dynamically
		const TesseractLib = await loadTesseract();
		
		// Perform OCR using Tesseract.js with optimized settings for medical text
		const { data: { text } } = await TesseractLib.recognize(blob, 'eng', {
			logger: (m) => {
				// Only log progress for debugging, not every message
				if (m.status === 'recognizing text') {
					console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`)
				}
			}
		})
		
		// Clean up the extracted text
		let cleanedText = text.trim()
		
		// Remove excessive whitespace and normalize line breaks
		cleanedText = cleanedText.replace(/\s+/g, ' ')
		cleanedText = cleanedText.replace(/\n\s*\n/g, '\n\n')
		
		// Remove common OCR artifacts
		cleanedText = cleanedText.replace(/[^\w\s.,;:!?()\[\]{}'"\-+=/\\@#$%^&*|<>~`]/g, '')
		
		return cleanedText
	} catch (error) {
		console.error('OCR extraction failed:', error)
		throw new Error('OCR text extraction failed')
	}
}

/**
 * Extracts text from PDF using OCR as fallback
 */
async function extractTextWithOCR(pdf: pdfjsLib.PDFDocumentProxy, fileInfo: { name: string; size: number; type: string; pageCount: number }): Promise<ExtractResult> {
	try {
		console.log('Attempting OCR extraction for PDF...')
		let extractedText = ''
		const totalPages = pdf.numPages
		
		// Process pages in batches to avoid memory issues
		// Use smaller batch size for better performance and memory management
		const batchSize = 2
		for (let i = 1; i <= totalPages; i += batchSize) {
			const endPage = Math.min(i + batchSize - 1, totalPages)
			console.log(`Processing pages ${i}-${endPage} of ${totalPages} with OCR...`)
			
			const pagePromises = []
			for (let pageNum = i; pageNum <= endPage; pageNum++) {
				pagePromises.push(
					pdf.getPage(pageNum).then(async (page) => {
						// Use 1.5x scale for better balance between speed and accuracy
						const canvas = await pdfPageToCanvas(page, 1.5)
						const pageText = await extractTextFromCanvas(canvas)
						return pageText
					})
				)
			}
			
			const pageTexts = await Promise.all(pagePromises)
			extractedText += pageTexts.join('\n\n')
			
			// Add small delay between batches to prevent overwhelming the browser
			if (endPage < totalPages) {
				await new Promise(resolve => setTimeout(resolve, 300))
			}
		}
		
		if (!extractedText || extractedText.trim() === '') {
			return {
				success: false,
				error: 'OCR could not extract any readable text from the PDF',
				fileInfo
			}
		}
		
		console.log(`OCR extraction successful: ${extractedText.length} characters extracted`)
		return {
			success: true,
			text: extractedText,
			fileInfo,
			method: 'ocr'
		}
	} catch (error) {
		console.error('OCR extraction failed:', error)
		return {
			success: false,
			error: `OCR extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
			fileInfo
		}
	}
}

export async function extractTextFromPDF(pdfFile: File): Promise<ExtractResult> {
	try {
		if (!pdfFile || pdfFile.type !== 'application/pdf') {
			return { success: false, error: 'The uploaded file is not a PDF' }
		}

		const arrayBuffer = await pdfFile.arrayBuffer()
		const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
		const pdf = await loadingTask.promise

		const fileInfo = {
			name: pdfFile.name,
			size: pdfFile.size,
			type: pdfFile.type,
			pageCount: pdf.numPages,
		}

		// First, try OCR extraction (primary method for better reliability)
		// Skip OCR for very large PDFs (>20 pages) to avoid performance issues
		if (pdf.numPages <= 20) {
			console.log('Attempting OCR text extraction (primary method)...')
			const ocrResult = await extractTextWithOCR(pdf, fileInfo)
			
			// If OCR was successful, use it
			if (ocrResult.success) {
				console.log(`OCR extraction successful: ${ocrResult.text.length} characters extracted`)
				return ocrResult
			}
		} else {
			console.log(`PDF has ${pdf.numPages} pages, skipping OCR for performance. Using PDF.js directly.`)
		}

		// If OCR failed, try PDF.js as fallback
		console.log('OCR extraction failed, attempting PDF.js fallback...')
		let extractedText = ''
		const totalPages = pdf.numPages

		for (let i = 1; i <= totalPages; i++) {
			const page = await pdf.getPage(i)
			const textContent = await page.getTextContent()
			const textItems = textContent.items.map((item) => {
				if ('str' in item && item.str) {
					return String(item.str);
				}
				return '';
			})
			extractedText += textItems.join(' ') + '\n\n'
		}

		// Check if we got meaningful text from PDF.js
		const meaningfulText = extractedText.trim().replace(/\s+/g, ' ')
		if (meaningfulText.length > 50) {
			console.log(`PDF.js fallback successful: ${meaningfulText.length} characters extracted`)
			return {
				success: true,
				text: extractedText,
				fileInfo,
				method: 'pdfjs'
			}
		}

		// Both methods failed
		return {
			success: false,
			error: 'Unable to extract text using both OCR and PDF.js methods',
			fileInfo
		}

	} catch (error: unknown) {
		console.error('Error extracting text from PDF:', error)
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to extract text from the PDF',
			fileInfo: {
				name: pdfFile?.name,
				size: pdfFile?.size,
				type: pdfFile?.type,
			},
		}
	}
}

/**
 * Splits text into equal-sized chunks for processing
 * @param text The text to split
 * @param maxChunkSize Maximum characters per chunk (default: 8000)
 * @param overlap Overlap between chunks in characters (default: 500)
 * @returns Array of text chunks
 */
export function splitTextIntoChunks(
	text: string, 
	maxChunkSize: number = 8000, 
	overlap: number = 500
): string[] {
	if (text.length <= maxChunkSize) {
		return [text];
	}

	const chunks: string[] = [];
	let start = 0;

	while (start < text.length) {
		let end = start + maxChunkSize;
		
		// If this isn't the last chunk, try to break at a sentence or word boundary
		if (end < text.length) {
			// Look for sentence endings within the last 200 characters
			const searchStart = Math.max(start + maxChunkSize - 200, start);
			const sentenceEnd = text.lastIndexOf('.', end);
			const questionEnd = text.lastIndexOf('?', end);
			const exclamationEnd = text.lastIndexOf('!', end);
			
			const bestBreak = Math.max(sentenceEnd, questionEnd, exclamationEnd);
			
			if (bestBreak > searchStart) {
				end = bestBreak + 1;
			} else {
				// Fall back to word boundary
				const wordEnd = text.lastIndexOf(' ', end);
				if (wordEnd > start + maxChunkSize * 0.8) {
					end = wordEnd;
				}
			}
		}

		chunks.push(text.slice(start, end).trim());
		start = end - overlap;
		
		// Prevent infinite loop
		if (start >= end) {
			start = end;
		}
	}

	return chunks.filter(chunk => chunk.length > 0);
}


