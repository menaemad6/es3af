export interface AIMessage {
  role: 'user' | 'model' | 'assistant';
  content: string;
}

export interface GeminiConfig {
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  responseFormat?: 'text' | 'json';
}

export interface GeminiResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function fetchAI(
  messages: AIMessage[],
  config: GeminiConfig = {}
): Promise<GeminiResponse> {
  const {
    temperature = 0.2,
    maxTokens = 2000,
    systemPrompt,
    responseFormat = 'text'
  } = config;

  try {
    // Prepare request body
    const requestBody: any = {
      contents: messages.map(msg => ({
        parts: [{ text: msg.content }],
        role: msg.role === 'assistant' ? 'model' : msg.role
      })),
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens,
        responseMimeType: responseFormat === 'json' ? 'application/json' : 'text/plain'
      }
    };

    // Add system instruction if provided
    if (systemPrompt) {
      requestBody.systemInstruction = {
        parts: [{ text: systemPrompt }]
      };
    }

    // Send request to Gemini API
    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Error Fetching Response";

    return {
      content,
      usage: data?.usageMetadata ? {
        promptTokens: data.usageMetadata.promptTokenCount || 0,
        completionTokens: data.usageMetadata.candidatesTokenCount || 0,
        totalTokens: data.usageMetadata.totalTokenCount || 0
      } : undefined
    };
  } catch (error) {
    console.error("Error in fetchAI:", error);
    throw error;
  }
}
