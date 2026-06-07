import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Sparkles, Image, Zap, TrendingUp } from 'lucide-react';

const TRENDING_ITEMS = [
  { title: 'Cinematic Ghibli Portrait', meta: '2.4k uses today', icon: Sparkles, color: '#8B5CF6', type: 'prompt' },
  { title: 'Neon Cyberpunk Cityscapes', meta: 'Trending in Image Gen', icon: Image, color: '#E98074', type: 'style' },
  { title: 'Prompt Enhancer → Midjourney', meta: '1.8k uses this week', icon: Zap, color: '#D83F87', type: 'tool' },
  { title: '3D Product Mockup Generator', meta: 'New · Rising fast', icon: Flame, color: '#fbbf24', type: 'prompt' },
  { title: 'Minimalist Logo Design', meta: '900+ copies today', icon: Sparkles, color: '#6B4DB3', type: 'style' },
  { title: 'AI Headshot Generator', meta: '1.2k uses today', icon: Image, color: '#34d399', type: 'prompt' },
];

// Duplicate for infinite scroll effect
const ITEMS = [...TRENDING_ITEMS, ...TRENDING_ITEMS];

export const TrendingBar: React.FC = () => {
  return (
    <div
      className="relative overflow-hidden border-b border-white/[0.04]"
      style={{
        background: 'rgba(255,255,255,0.015)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="container mx-auto px-4 flex items-center h-10 gap-3">
        {/* Label — fixed left */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pr-3 border-r border-white/[0.06]">
          <TrendingUp className="w-3 h-3 text-[#D83F87]" />
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em]">Trending</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D83F87] shadow-[0_0_6px_rgba(216,63,135,0.5)] animate-pulse" />
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(19,19,22,1), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, rgba(19,19,22,1), transparent)' }} />

          <motion.div
            className="flex items-center gap-6 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 35, ease: 'linear', repeat: Infinity }}
          >
            {ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={`${item.title}-${i}`}
                  href="/#library"
                  className="flex items-center gap-2 group transition-opacity hover:opacity-100 opacity-70 no-underline flex-shrink-0"
                >
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Icon className="w-3 h-3" style={{ color: item.color }} />
                  </div>
                  <span className="text-[11px] font-semibold text-white/50 group-hover:text-white/80 transition-colors">
                    {item.title}
                  </span>
                  <span
                    className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{ color: `${item.color}99`, backgroundColor: `${item.color}10` }}
                  >
                    {item.type}
                  </span>
                </a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
