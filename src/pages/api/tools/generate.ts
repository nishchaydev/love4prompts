import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;
const USE_CASES = ['Image Generation', 'Text', 'Code', 'Marketing', 'Study'] as const;

const SYSTEM_PROMPTS: Record<string, string> = {
  'Image Generation': `You are an expert AI image prompt engineer. The user will give you a plain English description of what they want to create. Write a detailed, ready-to-use image generation prompt optimized for TARGET_TOOL. Include style, mood, lighting, composition, and quality modifiers. Return only the prompt text, nothing else.`,
  'Text': `You are an expert prompt engineer for text/chat AI models. The user will describe what they need. Write a detailed, effective prompt optimized for TARGET_TOOL that will get the best results. Include clear instructions, context, and format requirements. Return only the prompt text, nothing else.`,
  'Code': `You are an expert prompt engineer for coding tasks. The user will describe a coding task or problem. Write a precise, detailed prompt optimized for TARGET_TOOL that will produce high-quality code output. Include language, framework, constraints, and expected output format. Return only the prompt text, nothing else.`,
  'Marketing': `You are an expert prompt engineer for marketing and copywriting. The user will describe a marketing need. Write a comprehensive prompt optimized for TARGET_TOOL that will generate effective marketing copy. Include tone, audience, format, and key messaging requirements. Return only the prompt text, nothing else.`,
  'Study': `You are an expert prompt engineer for educational content. The user will describe a study or learning topic. Write a detailed prompt optimized for TARGET_TOOL that will create comprehensive study material. Include depth, format, examples, and learning objectives. Return only the prompt text, nothing else.`,
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { description, targetTool, useCase } = body;

    if (!description || typeof description !== 'string' || description.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Description is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (description.length > 10000) {
      return new Response(JSON.stringify({ error: 'Description exceeds 10,000 character limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!targetTool || !AI_TOOLS.includes(targetTool)) {
      return new Response(JSON.stringify({ error: `Invalid target tool. Must be one of: ${AI_TOOLS.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!useCase || !USE_CASES.includes(useCase)) {
      return new Response(JSON.stringify({ error: `Invalid use case. Must be one of: ${USE_CASES.join(', ')}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = SYSTEM_PROMPTS[useCase].replace(/TARGET_TOOL/g, targetTool);

    const result = await callGroq({
      systemPrompt,
      userMessage: description.trim(),
    });

    return new Response(JSON.stringify({ generatedPrompt: result.content }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Generate API error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
