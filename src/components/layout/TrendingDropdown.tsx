import React, { useState, useRef, useEffect } from 'react';
import { TrendingUp, Flame, Sparkles, Image, Zap, ChevronDown } from 'lucide-react';

const TRENDING_ITEMS = [
  {
    type: 'prompt' as const,
    title: 'Cinematic Ghibli Portrait',
    meta: '2.4k uses today',
    icon: Sparkles,
    color: '#8B5CF6',
    href: '/#library',
  },
  {
    type: 'style' as const,
    title: 'Neon Cyberpunk Cityscapes',
    meta: 'Trending in Image Gen',
    icon: Image,
    color: '#E98074',
    href: '/#library',
  },
  {
    type: 'tool' as const,
    title: 'Prompt Enhancer → Midjourney',
    meta: '1.8k uses this week',
    icon: Zap,
    color: '#D83F87',
    href: '/tools/prompt-enhancer',
  },
  {
    type: 'prompt' as const,
    title: '3D Product Mockup Generator',
    meta: 'New · Rising fast',
    icon: Flame,
    color: '#fbbf24',
    href: '/#library',
  },
  {
    type: 'style' as const,
    title: 'Minimalist Logo Design',
    meta: '900+ copies today',
    icon: Sparkles,
    color: '#6B4DB3',
    href: '/#library',
  },
];

export const TrendingDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
          open
            ? 'bg-white/10 text-white'
            : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
        }`}
      >
        <TrendingUp className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">Trending</span>
        {/* Live dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-[#D83F87] shadow-[0_0_6px_rgba(216,63,135,0.6)] animate-pulse" />
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-80 overflow-hidden py-2 animate-in fade-in slide-in-from-top-3 duration-200 z-50 rounded-2xl"
          style={{
            background: 'rgba(26, 26, 32, 0.92)',
            backdropFilter: 'blur(40px) saturate(1.5)',
            WebkitBackdropFilter: 'blur(40px) saturate(1.5)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 50px -15px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 text-[11px] font-bold text-white/40 uppercase tracking-[0.15em]">
              <Flame className="w-3 h-3 text-[#D83F87]" />
              Trending Now
            </div>
            <span className="text-[10px] font-semibold text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">Live</span>
          </div>

          {/* Items */}
          {TRENDING_ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <a
                key={i}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 transition-all duration-200 no-underline hover:bg-white/[0.04] group"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110"
                  style={{
                    backgroundColor: `${item.color}12`,
                    boxShadow: `0 0 0 1px ${item.color}15`,
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: item.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-white/25 font-medium truncate">{item.meta}</p>
                </div>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md"
                  style={{
                    color: `${item.color}aa`,
                    backgroundColor: `${item.color}10`,
                  }}
                >
                  {item.type}
                </span>
              </a>
            );
          })}

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/[0.06]">
            <a
              href="/#library"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-[var(--color-primary)] hover:text-white transition-colors no-underline"
            >
              View all trending →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
