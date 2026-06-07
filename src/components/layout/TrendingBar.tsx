import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const ITEMS = [
  'Ghibli Portrait Prompts',
  'Cyberpunk Cityscapes',
  'Prompt Enhancer → Midjourney',
  '3D Product Mockups',
  'Minimalist Logo Design',
  'AI Headshot Generator',
  'Cinematic Film Stills',
  'Watercolor Illustration',
];

// Duplicate for seamless loop
const ALL = [...ITEMS, ...ITEMS];

export const TrendingBar: React.FC = () => {
  return (
    <div className="border-b border-white/[0.04] bg-[#0A0118]/60 backdrop-blur-sm h-9 flex items-center overflow-hidden z-20 relative">
      <div className="container mx-auto px-4 flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em] font-mono">Trending</span>
        </div>

        <div className="w-px h-3 bg-white/[0.06]" />

        {/* Ticker */}
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--color-background-primary), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--color-background-primary), transparent)' }} />

          <motion.div
            className="flex items-center gap-6 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
          >
            {ALL.map((item, i) => (
              <span key={`${item}-${i}`} className="text-[11px] text-white/20 font-medium">
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
