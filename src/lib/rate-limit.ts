import { supabase } from './supabase';

import { DAILY_LIMIT } from './server-rate-limit';

// Fallback logic for anonymous users
function getTodayKey(toolName: string): string {
  if (typeof window === 'undefined') return '';
  const today = new Date().toISOString().split('T')[0];
  return `ratelimit_${toolName}_${today}`;
}

export async function getRemainingUses(toolName: string): Promise<number> {
  if (typeof window === 'undefined') return DAILY_LIMIT;

  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // Check Supabase for server-side count
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('tool_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .eq('tool_name', toolName)
      .gte('created_at', today.toISOString());

    if (error) {
      console.error('Failed to get usage from Supabase:', error);
      return 0; // fail safe
    }
    
    return Math.max(0, DAILY_LIMIT - (count || 0));
  } else {
    // Fallback to local storage for anonymous users
    const key = getTodayKey(toolName);
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    return Math.max(0, DAILY_LIMIT - count);
  }
}

export async function hasReachedLimit(toolName: string): Promise<boolean> {
  const remaining = await getRemainingUses(toolName);
  return remaining <= 0;
}

export async function recordUse(toolName: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.user) {
    // Server-side API handles recording usage for logged-in users.
    // We don't do it here to prevent double-counting.
    return;
  } else {
    const key = getTodayKey(toolName);
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, String(count + 1));
  }
}

