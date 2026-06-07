import React, { useState, useEffect } from 'react';
import { Loader2, ArrowRightLeft } from 'lucide-react';
import { ToolPageLayout } from './ToolPageLayout';
import { AiToolSelector, type AiTool } from './AiToolSelector';
import { CopyableOutput } from './CopyableOutput';
import { recordUse, hasReachedLimit } from '../../lib/rate-limit';

const TOOL_SLUG = 'prompt-translator';

export const PromptTranslator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [fromTool, setFromTool] = useState<AiTool | ''>('');
  const [toTool, setToTool] = useState<AiTool | ''>('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [, forceUpdate] = useState(0);

  // Pre-fill from UniversalBar query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q');
    if (q) setPrompt(q);
  }, []);

  const handleSwap = () => {
    const temp = fromTool;
    setFromTool(toTool);
    setToTool(temp);
  };

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to translate.');
      return;
    }
    if (!fromTool) {
      setError('Please select the source AI tool.');
      return;
    }
    if (!toTool) {
      setError('Please select the target AI tool.');
      return;
    }
    if (fromTool === toTool) {
      setError('Source and target tools must be different.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError('You\'ve reached your daily limit of 5 free translations. Try again tomorrow!');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const response = await fetch('/api/tools/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), fromTool, toTool }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setResult(data.translatedPrompt);
      recordUse(TOOL_SLUG);
      forceUpdate((n) => n + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to translate prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      toolName="Prompt Translator"
      toolSlug={TOOL_SLUG}
      title="Prompt Translator"
      description="Got a prompt that works great in Midjourney but you want it for DALL-E? Translate between any AI tools instantly."
      accentColor="#8a2be2"
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="translator-input" className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
            Your Prompt
          </label>
          <textarea
            id="translator-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Paste a prompt written for any AI tool..."
            rows={5}
            maxLength={10000}
            className="w-full bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-2xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-purple)]/50 focus:border-transparent transition-all resize-none hover:border-white/20"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">{prompt.length}/10,000</span>
          </div>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <AiToolSelector
              value={fromTool}
              onChange={setFromTool}
              label="From"
              id="from-tool-select"
            />
          </div>

          <button
            onClick={handleSwap}
            className="flex-none mb-[2px] w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-[var(--color-text-muted)] hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
            aria-label="Swap tools"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <AiToolSelector
              value={toTool}
              onChange={setToTool}
              label="To"
              id="to-tool-select"
            />
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
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#8a2be2] to-[#c060ff] text-white text-base font-bold hover:shadow-[0_0_30px_rgba(138,43,226,0.3)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Translating...
            </>
          ) : (
            'Translate Prompt'
          )}
        </button>
      </div>

      {result && <CopyableOutput content={result} targetTool={toTool || undefined} />}
    </ToolPageLayout>
  );
};
