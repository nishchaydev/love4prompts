const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-20250514';

interface ClaudeTextRequest {
  systemPrompt: string;
  userMessage: string;
  maxTokens?: number;
}

interface ClaudeVisionRequest {
  systemPrompt: string;
  imageBase64: string;
  mimeType: 'image/jpeg' | 'image/png' | 'image/webp';
  userMessage?: string;
  maxTokens?: number;
}

interface ClaudeResponse {
  content: string;
  usage: { input_tokens: number; output_tokens: number };
}

function getApiKey(): string {
  const key = import.meta.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is not set in environment variables.');
  }
  return key;
}

export async function callClaude(request: ClaudeTextRequest): Promise<ClaudeResponse> {
  const apiKey = getApiKey();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: request.maxTokens ?? 2048,
      system: request.systemPrompt,
      messages: [
        { role: 'user', content: request.userMessage },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text ?? '',
    usage: data.usage,
  };
}

export async function callClaudeVision(request: ClaudeVisionRequest): Promise<ClaudeResponse> {
  const apiKey = getApiKey();

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: request.maxTokens ?? 2048,
      system: request.systemPrompt,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: request.mimeType,
                data: request.imageBase64,
              },
            },
            {
              type: 'text',
              text: request.userMessage ?? 'Analyze this image.',
            },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Claude Vision API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  return {
    content: data.content[0]?.text ?? '',
    usage: data.usage,
  };
}
