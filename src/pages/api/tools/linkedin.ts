import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { topic, tone, hookStyle, includeCTA } = body;

    // Validation
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Post topic is required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (topic.length > 500) {
      return new Response(JSON.stringify({ error: 'Topic exceeds 500 character limit.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const validTones = ['Professional', 'Storytelling', 'Thought Leadership', 'Casual'];
    const selectedTone = validTones.includes(tone) ? tone : 'Storytelling';

    const validHooks = ['Question', 'Bold Statement', 'Personal Story'];
    const selectedHook = validHooks.includes(hookStyle) ? hookStyle : 'Personal Story';

    // Build the system prompt
    const systemPrompt = `You are an expert LinkedIn ghostwriter and copywriter.
Your goal is to write a highly engaging, viral LinkedIn post based on the user's topic.

Strictly adhere to the following formatting and style guidelines:
1. Tone of voice: ${selectedTone} (adapt vocabulary, pacing, and overall style accordingly)
2. Opening Hook Style: ${selectedHook} (craft the very first line to match this hook category exactly)
3. Call to Action (CTA): ${includeCTA ? 'Ensure the post ends with a compelling call to action/question to drive engagement.' : 'Do NOT include a call to action or closing question at the end.'}

LinkedIn Formatting Rules:
- Start with a scroll-stopping hook as the first line.
- Use high readability: use single-sentence paragraphs, line breaks, and whitespace to prevent visual clutter.
- Keep the writing style natural, punchy, and human. AVOID generic corporate clichés like "excited to announce", "humbled", "thrilled".
- Add 3-5 relevant, trending hashtags at the very bottom.
- Output ONLY the final generated post text. Do not include any introduction, conversational filler, conversational markup, or labels like "Hook:", "Body:", etc. Just write the post.`;

    const result = await callGroq({
      systemPrompt,
      userMessage: `Topic/Details: ${topic.trim()}`,
    });

    const postContent = result.content.trim();

    return new Response(JSON.stringify({ post: postContent }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('LinkedIn API error occurred.');
    return new Response(JSON.stringify({ error: 'Failed to generate post. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
