const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

interface GroqTextRequest {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

interface GroqResponse {
  content: string;
}

const VISION_MODEL = 'llama-3.2-11b-vision-preview';

interface GroqVisionRequest {
  systemPrompt: string;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  userMessage?: string;
  maxTokens?: number;
}

function getApiKey(): string {
  const key = import.meta.env.GROQ_API_KEY;
  if (!key) {
    throw new Error('GROQ_API_KEY is not set in environment variables.');
  }
  return key;
}

export async function callGroq(request: GroqTextRequest): Promise<GroqResponse> {
  const apiKey = getApiKey();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: request.maxTokens ?? 2048,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { role: 'user', content: request.userMessage },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content ?? '',
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function callGroqVision(request: GroqVisionRequest): Promise<GroqResponse> {
  const apiKey = getApiKey();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: VISION_MODEL,
        max_tokens: request.maxTokens ?? 2048,
        messages: [
          { role: 'system', content: request.systemPrompt },
          { 
            role: 'user', 
            content: [
              { type: 'text', text: request.userMessage ?? 'Analyze this image.' },
              { type: 'image_url', image_url: { url: `data:${request.mimeType};base64,${request.imageBase64}` } }
            ] 
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Groq Vision API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content ?? '',
    };
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
