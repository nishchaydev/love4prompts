const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';
const VISION_MODEL = 'llama-3.2-11b-vision-preview';

interface GroqTextRequest {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

interface GroqResponse {
  content: string;
}

interface GroqVisionRequest {
  systemPrompt: string;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  userMessage?: string;
  maxTokens?: number;
}

// ─── Key rotation with automatic fallback ──────────────────────────
function getApiKeys(): string[] {
  const keys: string[] = [];
  const primary = import.meta.env.GROQ_API_KEY;
  const fallback1 = import.meta.env.GROQ_API_KEY_FALLBACK;
  const fallback2 = import.meta.env.GROQ_API_KEY_FALLBACK_2;
  if (primary) keys.push(primary);
  if (fallback1) keys.push(fallback1);
  if (fallback2) keys.push(fallback2);
  if (keys.length === 0) {
    throw new Error('No GROQ_API_KEY is set in environment variables.');
  }
  return keys;
}

// ─── Core fetch with automatic key failover ────────────────────────
async function fetchWithFallback(
  body: Record<string, unknown>,
  timeoutMs = 15000,
): Promise<GroqResponse> {
  const keys = getApiKeys();
  let lastError: Error | null = null;

  for (const key of keys) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Rate-limited or auth failure → try next key
      if (response.status === 429 || response.status === 401 || response.status === 403) {
        const errorBody = await response.text();
        lastError = new Error(`Groq API ${response.status}: ${errorBody}`);
        console.warn(`[groq] Key ending ...${key.slice(-6)} hit ${response.status}, trying next key`);
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();
      return {
        content: data.choices[0]?.message?.content ?? '',
      };
    } catch (error: any) {
      clearTimeout(timeoutId);

      // Network / timeout errors → try next key
      if (error.name === 'AbortError' || error.message?.includes('fetch')) {
        lastError = error;
        console.warn(`[groq] Key ending ...${key.slice(-6)} timed out, trying next key`);
        continue;
      }

      // Re-throw non-retryable errors
      throw error;
    }
  }

  throw lastError ?? new Error('All Groq API keys exhausted.');
}

// ─── Public API ────────────────────────────────────────────────────
export async function callGroq(request: GroqTextRequest): Promise<GroqResponse> {
  return fetchWithFallback({
    model: MODEL,
    max_tokens: request.maxTokens ?? 2048,
    messages: [
      { role: 'system', content: request.systemPrompt },
      { role: 'user', content: request.userMessage },
    ],
  });
}

export async function callGroqVision(request: GroqVisionRequest): Promise<GroqResponse> {
  return fetchWithFallback(
    {
      model: VISION_MODEL,
      max_tokens: request.maxTokens ?? 2048,
      messages: [
        { role: 'system', content: request.systemPrompt },
        {
          role: 'user',
          content: [
            { type: 'text', text: request.userMessage ?? 'Analyze this image.' },
            {
              type: 'image_url',
              image_url: {
                url: `data:${request.mimeType};base64,${request.imageBase64}`,
              },
            },
          ],
        },
      ],
    },
    20000, // vision needs more time
  );
}
