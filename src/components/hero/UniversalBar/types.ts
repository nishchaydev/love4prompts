import React from 'react';

export interface RecentEntry {
  input: string;
  output: string;
  model: string;
  mode: string;
  timestamp: number;
}

export interface Intent {
  mode: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  color: string;
  apiEndpoint: string;
  buildPayload: (input: string, model: string) => Record<string, unknown>;
  extractResult: (data: unknown) => string;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isLocalStorageAvailable(): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    const testKey = '__ilp_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}
