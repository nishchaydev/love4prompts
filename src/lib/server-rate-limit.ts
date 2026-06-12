import { supabase } from './supabase';

const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
export const DAILY_LIMIT = 5;

// In-memory store for anonymous users
const ipRateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function checkServerRateLimit(
  request: Request,
  toolName: string
): Promise<{ allowed: boolean; error?: string; userId?: string; clientIp?: string }> {
  const authHeader = request.headers.get('Authorization');
  let userId: string | undefined = undefined;

  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown-ip';

  // 1. Authenticated User Check
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (user) {
      userId = user.id;
      
      // Check if user is Pro
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_pro')
        .eq('id', userId)
        .single();
        
      if (profileError) {
        console.error('Error fetching profile in rate limit check:', profileError);
      }
        
      if (profile?.is_pro) {
        return { allowed: true, userId, clientIp: ip };
      }

      // If not Pro, check tool_usage count for today
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const { count } = await supabase
        .from('tool_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('tool_name', toolName)
        .gte('created_at', today.toISOString());

      if ((count || 0) >= DAILY_LIMIT) {
        return { allowed: false, error: `You've reached your daily limit of ${DAILY_LIMIT} free uses.` };
      }

      return { allowed: true, userId, clientIp: ip };
    }
  }

  // 2. Anonymous User Check (IP-based)
  // Get IP from common proxy headers, fallback to a default if not found
             
  const now = Date.now();
  const record = ipRateLimitStore.get(ip);

  if (!record || record.resetTime < now) {
    ipRateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, clientIp: ip };
  }

  if (record.count >= DAILY_LIMIT) {
    return { allowed: false, error: `You've reached your daily limit of ${DAILY_LIMIT} free uses.` };
  }

  record.count += 1;
  return { allowed: true, clientIp: ip };
}

export async function recordServerUsage(userId: string | undefined, toolName: string, clientIp?: string) {
  if (userId || clientIp) {
    const payload: any = {
      tool_name: toolName
    };
    if (userId) payload.user_id = userId;
    if (clientIp && clientIp !== 'unknown-ip') payload.client_ip = clientIp;

    await supabase.from('tool_usage').insert(payload);
  }
}
