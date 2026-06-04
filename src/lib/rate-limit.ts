export const DAILY_LIMIT = 5;

function getTodayKey(toolName: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `ratelimit_${toolName}_${today}`;
}

export function getUsageCount(toolName: string): number {
  if (typeof window === 'undefined') return 0;
  const key = getTodayKey(toolName);
  const count = parseInt(localStorage.getItem(key) || '0', 10);
  return count;
}

export function getRemainingUses(toolName: string): number {
  return Math.max(0, DAILY_LIMIT - getUsageCount(toolName));
}

export function recordUse(toolName: string): void {
  if (typeof window === 'undefined') return;
  const key = getTodayKey(toolName);
  const current = getUsageCount(toolName);
  localStorage.setItem(key, String(current + 1));
}

export function hasReachedLimit(toolName: string): boolean {
  return getUsageCount(toolName) >= DAILY_LIMIT;
}

export async function recordServerUse(
  toolName: string,
  userId: string | null
): Promise<void> {
  if (!userId) return;
  try {
    const { supabase } = await import('./supabase');
    await supabase.from('tool_usage').insert({
      user_id: userId,
      tool_name: toolName,
    });
  } catch (err) {
    console.error('Failed to record server usage:', err);
  }
}
