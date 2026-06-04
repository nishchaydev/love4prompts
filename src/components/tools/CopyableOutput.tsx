import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface CopyableOutputProps {
  content: string;
  targetTool?: string;
}

const TOOL_URLS: Record<string, string> = {
  ChatGPT: 'https://chat.openai.com/?q=',
  Midjourney: 'https://www.midjourney.com/',
  'DALL-E': 'https://www.bing.com/images/create?q=',
  Claude: 'https://claude.ai/new?q=',
  Gemini: 'https://gemini.google.com/app?q=',
  Flux: 'https://flux.dev/',
};

export const CopyableOutput: React.FC<CopyableOutputProps> = ({ content, targetTool }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateUrl = targetTool && TOOL_URLS[targetTool]
    ? `${TOOL_URLS[targetTool]}${encodeURIComponent(content)}`
    : null;

  return (
    <div className="mt-8 animate-fade-in-up">
      <label className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wider">
        Result
      </label>
      <div className="relative bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-2xl p-5 sm:p-6">
        <pre className="text-[var(--color-text-primary)] font-mono text-sm leading-relaxed whitespace-pre-wrap break-words pr-12">
          {content}
        </pre>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-gray-900 text-sm font-bold hover:bg-gray-100 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy Prompt
            </>
          )}
        </button>

        {generateUrl && (
          <a
            href={generateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-white text-sm font-bold hover:bg-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] no-underline"
          >
            <ExternalLink className="w-4 h-4" />
            Open in {targetTool}
          </a>
        )}
      </div>
    </div>
  );
};
