import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

interface TrendingItem {
  title: string;
  url: string;
}

export const TrendingBar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  const items: TrendingItem[] = [
    { title: 'AI-generated portraits are everywhere now', url: 'https://news.ycombinator.com/' },
    { title: 'Self-edited comments. HN is for conversation between humans', url: 'https://news.ycombinator.com/' },
    { title: 'Airfoil', url: 'https://news.ycombinator.com/' },
    { title: 'Open source AI is the path forward', url: 'https://news.ycombinator.com/' },
    { title: 'My AI skeptic friends are all nuts', url: 'https://news.ycombinator.com/' },
    { title: 'Android phones now generate AI images on-device', url: 'https://news.ycombinator.com/' },
  ];

  const ALL = [...items, ...items, ...items];

  return (
    <div className="hidden md:flex border-b border-[var(--color-border)] bg-[var(--color-bg)] h-9 items-center overflow-hidden z-20 relative">
      <div className="container mx-auto px-4 flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-[0.12em] font-mono">Trending</span>
        </div>

        <div className="w-px h-3 bg-[var(--color-border)]" />

        {/* Ticker — pure CSS marquee, no JS animation loop */}
        <div 
          className="flex-1 overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }} />

          <div 
            className="flex items-center gap-8 whitespace-nowrap ticker-track"
            style={{ animationPlayState: isHovered ? 'paused' : 'running' }}
          >
            {ALL.map((item, i) => (
              <a 
                key={`${item.title}-${i}`} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] text-[var(--color-text-muted)] font-medium hover:text-[var(--color-primary)] hover:underline transition-colors duration-200 font-[Epilogue]"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
