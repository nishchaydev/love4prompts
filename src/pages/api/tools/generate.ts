import type { APIRoute } from 'astro';
import { callGroq } from '../../../lib/groq';
import { buildExecutionSystemPrompt } from '../../../lib/promptSkills';
import { checkServerRateLimit, recordServerUsage } from '../../../lib/server-rate-limit';

const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;
const USE_CASES = ['Image Generation', 'Text', 'Code', 'Marketing', 'Study'] as const;

export const POST: APIRoute = async ({ request }) => {
  try {
    const rateLimitResult = await checkServerRateLimit(request, 'prompt-maker');
    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ error: rateLimitResult.error }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const body = await request.json();
    const { description, targetTool, useCase, styles, extraContext } = body;

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

    const safeIdea = description || 'None';
    const safeModel = targetTool || 'None';
    const safeCategory = useCase || 'None';
    const safeStyle = Array.isArray(styles) ? styles.join(', ') : (styles || 'None');
    const safeContext = extraContext || 'None';

    const systemPrompt = `You are an expert prompt engineer. 
Your job is to transform a user's rough idea into a 
world-class prompt they can immediately use.

═══════════════════════════════════
STEP 1 — DETECT THE OUTPUT TYPE
═══════════════════════════════════

Based on the target model, decide what to generate:

TARGET = ChatGPT / Claude / Gemini / Groq / any LLM →
  Generate a SYSTEM PROMPT (behavioral instructions for an AI).
  The user will paste this directly into that AI model.
  NEVER write design docs, architecture specs, or build plans.
  ALWAYS write: role + rules + output format.

TARGET = Midjourney / DALL-E / Flux / Stable Diffusion →
  Generate an IMAGE PROMPT.
  Format: [Subject] + [Art style] + [Lighting] + [Mood] + 
  [Camera/lens if relevant] + [Technical params].
  Be specific and visual. No instructions or rules — 
  just a vivid descriptive string.

TARGET = None selected →
  Determine intent from the idea:
  - If idea = "build / create / develop / make an app/tool/system" 
    → Generate a PROJECT BRIEF (structured requirements doc).
  - If idea = "act as / you are / a [role] that [does X]" 
    → Generate a SYSTEM PROMPT as if ChatGPT was the target.

═══════════════════════════════════
STEP 2 — APPLY CATEGORY RULES
═══════════════════════════════════

Category = Code →
  If LLM target: Include language-specific rules, 
  output format (code blocks), and error handling behavior.
  If no target: Assume system prompt for a coding AI.

Category = Image →
  Always generate an image prompt regardless of target.
  Remap the idea to visual descriptors.

Category = Writing →
  If LLM target: Define voice, tone, structure, 
  audience, and word count guidance.

Category = Marketing →
  If LLM target: Define platform, audience, goal 
  (awareness/conversion/retention), and CTA requirement.

Category = Study →
  If LLM target: Define the teaching style 
  (Socratic, explanatory, quiz-based), depth level, 
  and whether to use analogies or examples.

═══════════════════════════════════
STEP 3 — APPLY STYLE PREFERENCES
═══════════════════════════════════

Professional → Formal language, structured output, 
               no slang, include headings.
Creative     → Unexpected angles, metaphors welcome, 
               less rigid structure.
Minimal      → Strip everything non-essential. 
               Short sentences. Tight rules.
Detailed     → Include examples, edge cases, 
               and "if X then Y" branching.
Casual       → Conversational tone, 
               first-person where appropriate.
Technical    → Include precise terminology, 
               parameters, and format specs.

Multiple styles selected → blend them. 
Detailed + Minimal = concise but complete (no fluff, 
but covers edge cases).

═══════════════════════════════════
STEP 4 — BUILD THE OUTPUT
═══════════════════════════════════

FOR SYSTEM PROMPTS (LLM target):
  Structure EXACTLY like this:

  1. ROLE (1 sentence): "You are a [specific expert] who [does X]."
  2. CONTEXT (1-2 sentences): When/why this prompt is used.
  3. RULES (3-6 bullet points): 
     "When X, do Y." behavioral instructions.
     Be specific. No vague instructions like 
     "be helpful" or "be comprehensive."
  4. OUTPUT FORMAT: Exact structure the AI should 
     follow in every response.
  5. EXAMPLE (if Detailed style selected): 
     One concrete input → output example.

  FORBIDDEN in system prompts:
  ✗ "Build a system using Django/Flask"
  ✗ "Deploy to AWS Lambda"
  ✗ "Integrate with GitHub API"
  ✗ "Create a production-ready application"
  These are build instructions, not AI behavior rules.

FOR IMAGE PROMPTS:
  One flowing string, no XML tags, no headers.
  Max 100 words. Dense, visual, specific.

FOR PROJECT BRIEFS (no target, build intent):
  Use XML tags: <context> <instructions> 
  <output_format> <constraints> <requirements>
  This IS appropriate here — it's a human deliverable.

═══════════════════════════════════
STEP 5 — QUALITY CHECK
═══════════════════════════════════

Before returning, verify:
☑ If LLM target: Does it have a role, rules, 
  and output format?
☑ If LLM target: Can a person paste this directly 
  into ChatGPT and get useful output immediately?
☑ If image target: Is it purely descriptive 
  with no meta-instructions?
☑ Are style preferences reflected in the output?
☑ Is the additional context from the user 
  woven into the rules (not ignored)?

Inputs:
- Idea: \${safeIdea}
- Target Model: \${safeModel}
- Category: \${safeCategory}
- Style: \${safeStyle}
- Additional Context: \${safeContext}

Return ONLY the final prompt. 
No preamble. No "Here is your prompt:". 
No explanation of what you did.`;

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
      const executionSystemPrompt = buildExecutionSystemPrompt(targetTool as any);
      
      const secondResult = await callGroq({
        systemPrompt: executionSystemPrompt,
        userMessage: generatedPrompt,
      });
      directResponse = secondResult.content;
    } else {
      // For direct chat or image gen, the prompt itself is the final response
      directResponse = generatedPrompt;
    }

    await recordServerUsage(rateLimitResult.userId, 'prompt-maker', rateLimitResult.clientIp);
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

