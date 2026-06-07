import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;
const USE_CASES = ['Image Generation', 'Text', 'Code', 'Marketing', 'Study'] as const;

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

    // First LLM call: Determine mode (direct vs template prompt) and generate content
    const systemPrompt = `You are a prompt engineering expert and assistant. Analyze the user's input: "${description.trim()}".
You MUST respond with a valid JSON object in exactly this format:
{
  "isDirectChat": boolean,
  "output": "string"
}

Guidelines:
1. "isDirectChat":
   - Set to true if the user's input is a direct conversational message, greeting, simple question, or direct request (e.g. "hi", "how are you", "who is Albert Einstein?", "write a poem about love", "make a python script to add numbers").
   - Set to false if the user is describing a prompt they want to create or optimize (e.g. "enhance my prompt for marketing", "make a prompt for coding", "convert this prompt").

2. "output":
   - If "isDirectChat" is true: Write the direct, complete answer/response to the user's request.
   - If "isDirectChat" is false: Write a detailed, ready-to-use prompt optimized for ${targetTool} (usecase: ${useCase}) that will get the best results. Include clear instructions, context, and format requirements.

Return ONLY the raw JSON object. Do not include markdown code block wrappers (like \`\`\`json), explanations, or preambles outside the JSON.`;

    const firstResult = await callGroq({
      systemPrompt,
      userMessage: description.trim(),
    });

    let isDirectChat = false;
    let generatedPrompt = '';
    let directResponse = '';

    try {
      let cleaned = firstResult.content.trim();
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.substring(7);
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.substring(3);
      }
      if (cleaned.endsWith('```')) {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
      cleaned = cleaned.trim();

      const parsed = JSON.parse(cleaned);
      isDirectChat = typeof parsed.isDirectChat === 'boolean' ? parsed.isDirectChat : false;
      generatedPrompt = parsed.output || '';
    } catch (e) {
      console.warn('JSON parse failed in generate.ts, using fallback:', e);
      isDirectChat = false;
      generatedPrompt = firstResult.content;
    }

    const isImageGen = useCase === 'Image Generation';

    // Second LLM call: If it's prompt engineering (not direct chat) AND not an image generator prompt, execute it
    if (!isDirectChat && !isImageGen && generatedPrompt.trim().length > 0) {
      const executionSystemPrompt = `You are a helpful and intelligent AI assistant. Execute the user's prompt optimized for ${targetTool}. Provide only the direct final answer, output, or content requested. Do not include any meta-commentary, introductory phrases (like "Sure, here is the..."), or conversational preambles unless specifically requested by the prompt. Just output the content.`;
      
      const secondResult = await callGroq({
        systemPrompt: executionSystemPrompt,
        userMessage: generatedPrompt,
      });
      directResponse = secondResult.content;
    } else {
      // For direct chat or image gen, the prompt itself is the final response
      directResponse = generatedPrompt;
    }

    return new Response(JSON.stringify({
      generatedPrompt,
      directResponse,
      isDirectChat
    }), {
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

