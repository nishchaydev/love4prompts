import React from 'react';

export const AI_TOOLS = ['ChatGPT', 'Midjourney', 'DALL-E', 'Claude', 'Gemini', 'Flux'] as const;

export type AiTool = typeof AI_TOOLS[number];

const TOOL_ICONS: Record<AiTool, string> = {
  ChatGPT: '🤖',
  Midjourney: '🎨',
  'DALL-E': '🖼️',
  Claude: '🧠',
  Gemini: '✨',
  Flux: '⚡',
};

interface AiToolSelectorProps {
  value: AiTool | '';
  onChange: (tool: AiTool) => void;
  label?: string;
  id?: string;
}

export const AiToolSelector: React.FC<AiToolSelectorProps> = ({
  value,
  onChange,
  label = 'Target AI Tool',
  id = 'ai-tool-select',
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-[var(--color-text-secondary)] mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value as AiTool)}
          className="w-full appearance-none bg-[var(--color-background-elevated)] border border-white/[0.08] rounded-xl px-4 py-3 text-[var(--color-text-primary)] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-transparent transition-all cursor-pointer hover:border-white/20"
        >
          <option value="" disabled>
            Select AI tool...
          </option>
          {AI_TOOLS.map((tool) => (
            <option key={tool} value={tool}>
              {TOOL_ICONS[tool]} {tool}
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
  );
};
