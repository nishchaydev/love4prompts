import type { APIRoute } from 'astro';
import { callGroqVision } from '../../../lib/groq';

const VALID_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
const MAX_BASE64_SIZE = 5 * 1024 * 1024 * 1.37; // ~5MB file → ~6.85MB base64

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return new Response(JSON.stringify({ error: 'Image data is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (imageBase64.length > MAX_BASE64_SIZE) {
      return new Response(JSON.stringify({ error: 'Image exceeds 5MB size limit. Please upload a smaller image.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!mimeType || !VALID_MIME_TYPES.includes(mimeType)) {
      return new Response(JSON.stringify({ error: `Invalid image type. Accepted: ${VALID_MIME_TYPES.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are an expert at analyzing AI-generated images and reverse-engineering the prompts used to create them. Analyze this image in detail and write a comprehensive AI image generation prompt that could recreate it. Include details about: subject, composition, style, lighting, colors, mood, camera angle, and technical quality modifiers. Format the prompt for Midjourney. Return only the prompt text, no explanation.`;

    const result = await callGroqVision({
      systemPrompt,
      imageBase64,
      mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
      userMessage: 'Analyze this image and write a detailed AI image generation prompt that could recreate it.',
    });

    return new Response(JSON.stringify({ prompt: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Image-to-prompt API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
