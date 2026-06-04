import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { ToolPageLayout } from './ToolPageLayout';
import { AiToolSelector, type AiTool } from './AiToolSelector';
import { CopyableOutput } from './CopyableOutput';
import { recordUse, hasReachedLimit } from '../../lib/rate-limit';

const TOOL_SLUG = 'prompt-maker';

const USE_CASES = ['Image Generation', 'Text', 'Code', 'Marketing', 'Study'] as const;
type UseCase = typeof USE_CASES[number];

const USE_CASE_ICONS: Record<UseCase, string> = {
  'Image Generation': '🖼️',
  'Text': '📝',
  'Code': '💻',
  'Marketing': '📈',
  'Study': '📚',
};

export const PromptMaker: React.FC = () => {
  const [description, setDescription] = useState('');
  const [targetTool, setTargetTool] = useState<AiTool | ''>('');
  const [useCase, setUseCase] = useState<UseCase | ''>('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, forceUpdate] = useState(0);

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError('Please describe what you want to create.');
      return;
    }
    if (!targetTool) {
      setError('Please select a target AI tool.');
      return;
    }
    if (!useCase) {
      setError('Please select a use case.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError('You\'ve reached your daily limit of 5 free generations. Try again tomorrow!');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const response = await fetch('/api/tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: description.trim(), targetTool, useCase }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setResult(data.generatedPrompt);
      recordUse(TOOL_SLUG);
      forceUpdate((n) => n + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to generate prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      toolName="Prompt Maker"
      toolSlug={TOOL_SLUG}
      title="Prompt Maker"
      description="Describe your idea in plain English. We'll craft a ready-to-use prompt tailored to your AI tool and use case."
      accentColor="#00e5ff"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="maker-input" className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
            Describe Your Idea
          </label>
          <textarea
            id="maker-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., I want a professional LinkedIn post about the future of remote work in 2025..."
            rows={5}
            maxLength={10000}
            className="w-full bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-2xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/50 focus:border-transparent transition-all resize-none hover:border-white/20"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">{description.length}/10,000</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AiToolSelector value={targetTool} onChange={setTargetTool} />

          <div>
            <label htmlFor="use-case-select" className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
              Use Case
            </label>
            <div className="relative">
              <select
                id="use-case-select"
                value={useCase}
                onChange={(e) => setUseCase(e.target.value as UseCase)}
                className="w-full appearance-none bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-blue)]/50 focus:border-transparent transition-all cursor-pointer hover:border-white/20"
              >
                <option value="" disabled>Select use case...</option>
                {USE_CASES.map((uc) => (
                  <option key={uc} value={uc}>
                    {USE_CASE_ICONS[uc]} {uc}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-text-muted)]">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || hasReachedLimit(TOOL_SLUG)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#00e5ff] to-[#0088ff] text-white text-base font-bold hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Prompt'
          )}
        </button>
      </div>

      {result && <CopyableOutput content={result} targetTool={targetTool || undefined} />}
    </ToolPageLayout>
  );
};
