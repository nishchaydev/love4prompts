import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
}

const FALLBACK_ITEMS: NewsItem[] = [
  { title: 'Ghibli Portrait Prompts', url: '#' },
  { title: 'Cyberpunk Cityscapes', url: '#' },
  { title: 'Prompt Enhancer → Midjourney', url: '#' },
  { title: '3D Product Mockups', url: '#' },
  { title: 'Minimalist Logo Design', url: '#' },
  { title: 'AI Headshot Generator', url: '#' },
];

export const TrendingBar: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>(FALLBACK_ITEMS);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('https://hn.algolia.com/api/v1/search?query=AI&tags=story&hitsPerPage=10');
        const data = await res.json();
        if (data.hits && data.hits.length > 0) {
          const news = data.hits
            .filter((h: any) => h.title && h.url)
            .map((h: any) => ({ title: h.title, url: h.url }));
          if (news.length > 0) setItems(news);
        }
      } catch (err) {
        console.error('Failed to fetch trending news:', err);
      }
    };
    fetchNews();
  }, []);

  // Triplicate to ensure the loop doesn't run out of content on wide screens
  const ALL = [...items, ...items, ...items];

  return (
    <div className="hidden md:flex border-b border-white/[0.04] bg-[#0A0118]/60 backdrop-blur-sm h-9 items-center overflow-hidden z-20 relative">
      <div className="container mx-auto px-4 flex items-center gap-4">
        {/* Label */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <TrendingUp className="w-3.5 h-3.5 text-[var(--color-primary)]" />
          <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.12em] font-mono">Trending</span>
        </div>

        <div className="w-px h-3 bg-white/[0.06]" />

        {/* Ticker */}
        <div 
          className="flex-1 overflow-hidden relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--color-background-primary), transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left, var(--color-background-primary), transparent)' }} />

          <motion.div
            className="flex items-center gap-8 whitespace-nowrap"
            animate={{ x: isHovered ? undefined : ['0%', '-33.33%'] }}
            transition={isHovered ? {} : { duration: 30, ease: 'linear', repeat: Infinity }}
            style={{ x: isHovered ? undefined : '0%' }}
          >
            {ALL.map((item, i) => (
              <a 
                key={`${item.title}-${i}`} 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[11px] text-white/40 font-medium hover:text-[var(--color-primary)] hover:underline transition-colors duration-200"
              >
                {item.title}
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
