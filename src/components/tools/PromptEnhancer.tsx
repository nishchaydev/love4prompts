import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { ToolPageLayout } from './ToolPageLayout';
import { AiToolSelector, type AiTool } from './AiToolSelector';
import { CopyableOutput } from './CopyableOutput';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';

const TOOL_SLUG = 'prompt-enhancer';

export const PromptEnhancer: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [targetTool, setTargetTool] = useState<AiTool | ''>('');
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

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to enhance.');
      return;
    }
    if (!targetTool) {
      setError('Please select a target AI tool.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError('You\'ve reached your daily limit of 5 free enhancements. Try again tomorrow!');
      return;
    }

    setError('');
    setResult('');
    setLoading(true);

    try {
      const response = await fetch('/api/tools/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), targetTool }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setResult(data.enhancedPrompt);
      recordUse(TOOL_SLUG);
      forceUpdate((n) => n + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to enhance prompt. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      toolName="Prompt Enhancer"
      toolSlug={TOOL_SLUG}
      title="Prompt Enhancer"
      description="Paste your basic idea and get back an expertly crafted, detailed prompt optimized for your chosen AI tool."
      accentColor="#ff2a5f"
    >
      {/* Input Form */}
      <div className="space-y-5">
        <div>
          <label htmlFor="enhancer-input" className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
            Your Prompt
          </label>
          <textarea
            id="enhancer-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a cat sitting on a windowsill at sunset..."
            rows={5}
            maxLength={10000}
            className="w-full bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-2xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-transparent transition-all resize-none hover:border-white/20"
          />
          <div className="text-right mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">{prompt.length}/10,000</span>
          </div>
        </div>

        <AiToolSelector value={targetTool} onChange={setTargetTool} />

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || hasReachedLimit(TOOL_SLUG)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-primary)] text-white text-base font-bold hover:bg-[#cc001f] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none shadow-[0_0_25px_var(--color-primary-glow)]"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Enhancing...
            </>
          ) : (
            'Enhance Prompt'
          )}
        </button>
      </div>

      {/* Output */}
      {result && <CopyableOutput content={result} targetTool={targetTool || undefined} />}
    </ToolPageLayout>
  );
};
