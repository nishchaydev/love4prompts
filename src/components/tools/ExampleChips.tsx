import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Props {
  examples: string[];
  onSelect: (example: string) => void;
  disabled?: boolean;
}

/**
 * "Try these" example prompt chips — shows clickable example
 * prompts that auto-fill the input textarea when clicked.
 */
export const ExampleChips: React.FC<Props> = ({ examples, onSelect, disabled }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
        <Sparkles className="w-3 h-3 text-[var(--color-primary)]" />
        Try these
      </span>
      <div className="flex flex-wrap gap-2">
        {examples.map((example, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => !disabled && onSelect(example)}
            disabled={disabled}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="px-3 py-1.5 rounded-full text-[11px] font-medium border-[3px] border-black bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none max-w-[250px] truncate"
            title={example}
          >
            {example}
          </motion.button>
        ))}
      </div>
    </div>
  );
};
