import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
import { createClient } from '@supabase/supabase-js';

export const POST: APIRoute = async ({ request }) => {
  try {
    const rawBody = await request.json();
    
    // Validate and sanitize body
    if (
      typeof rawBody !== 'object' ||
      rawBody === null ||
      typeof rawBody.prompt !== 'string' ||
      rawBody.prompt.trim() === '' ||
      typeof rawBody.model !== 'string' ||
      rawBody.model.trim() === '' ||
      typeof rawBody.intent !== 'string' ||
      rawBody.intent.trim() === ''
    ) {
      return new Response(JSON.stringify({ success: false, error: 'Validation failed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const authHeader = request.headers.get('Authorization');
    let userId: string | undefined = undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user } } = await supabase.auth.getUser(token);
      if (user) {
        userId = user.id;
      }
    }

    const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials for service role');
      throw new Error('Server configuration error');
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error } = await supabaseAdmin
      .from('saved_prompts')
      .insert({
        user_id: userId ?? null,
        title: rawBody.intent,
        prompt: rawBody.prompt,
        target_tool: rawBody.model
      });

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to save to Supabase: ${error.message}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error saving prompt to Supabase:', error);
    return new Response(JSON.stringify({ success: false, error: 'Failed to save prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
