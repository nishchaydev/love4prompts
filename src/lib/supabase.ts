import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (!import.meta.env.PUBLIC_SUPABASE_URL) {
  console.warn('⚠️ PUBLIC_SUPABASE_URL is missing. Using a placeholder. Please set up your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
