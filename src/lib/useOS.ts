import { useState, useEffect } from 'react';

export type OSType = 'mac' | 'windows' | 'linux';

function detectOS(): OSType {
  if (typeof window === 'undefined') return 'windows';
  const ua = navigator.userAgent || '';
  const platform = (navigator as any).userAgentData?.platform || navigator.platform || '';
  if (/Mac|iPod|iPhone|iPad/i.test(platform) || /Macintosh/i.test(ua)) return 'mac';
  if (/Linux/i.test(platform)) return 'linux';
  return 'windows';
}

/**
 * Detects the user's operating system at runtime.
 * Returns 'mac', 'windows', or 'linux'.
 * SSR-safe: defaults to 'windows' during server render.
 */
export function useOS(): OSType {
  const [os, setOS] = useState<OSType>('windows');
  useEffect(() => { setOS(detectOS()); }, []);
  return os;
}

/**
 * Returns the correct modifier key label for the current OS.
 * Mac → '⌘', Windows/Linux → 'Ctrl'
 */
export function useModKey(): string {
  const os = useOS();
  return os === 'mac' ? '⌘' : 'Ctrl';
}
