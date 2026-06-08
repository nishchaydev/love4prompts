import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { input, model, charCount } = await request.json();

    if (!input || typeof input !== 'string' || input.trim().length < 2) {
      return json({ intent: 'GENERATE' }, 200);
    }
    
    const MAX_INPUT_LENGTH = 10000;
    if (input.length > MAX_INPUT_LENGTH) {
      return json({ intent: 'GENERATE', error: 'Input too long' }, 400);
    }

    const systemPrompt = `You are an intent classifier for a prompt engineering toolkit.

Given a user's input text, selected AI model, and character count, classify the intent as EXACTLY ONE of these labels:

ENHANCE   — User has an existing prompt and wants it improved, rewritten, or made better
GENERATE  — User has an idea or topic and wants a prompt created from scratch
TRANSLATE — User wants to convert a prompt from one AI tool to another (e.g. Midjourney to DALL-E)
IMAGE     — User wants an image generation prompt (for Midjourney, DALL-E, Flux, Stable Diffusion)
SOCIAL    — User wants content for LinkedIn, Instagram, Twitter, Facebook, or any social platform
EXECUTE   — User wants to directly run something through AI, not do prompt engineering
CODE      — User wants a coding prompt, system prompt for dev tools, or technical assistant prompt

Rules:
- Short inputs under 40 chars with no structure = GENERATE (user has a raw idea)
- Long inputs (100+ chars) with parameters or structure = ENHANCE (user has an existing prompt)
- If the selected model is "Midjourney", "DALL-E", or "Flux" = bias toward IMAGE
- If input mentions "LinkedIn", "post", "caption", "tweet", "Instagram" = SOCIAL
- If input mentions "convert", "translate", "from X to Y", "midjourney to" = TRANSLATE
- Do NOT overthink. Most inputs are either GENERATE or ENHANCE.

Respond with ONLY the label. No explanation. No punctuation. Just the label.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Input: "${input.trim()}"
Selected model: ${model || 'ChatGPT'}
Character count: ${charCount || input.length}`,
      maxTokens: 10,
    });

    const raw = result.content.trim().toUpperCase();
    const VALID = ['ENHANCE', 'GENERATE', 'TRANSLATE', 'IMAGE', 'SOCIAL', 'EXECUTE', 'CODE'];
    const intent = VALID.includes(raw) ? raw : 'GENERATE';

    return json({ intent }, 200);
  } catch (error) {
    console.error('Classification error:', error);
    return json({ intent: 'GENERATE' }, 200);
  }
};

function json(body: object, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
