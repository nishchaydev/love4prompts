import React, { useState, useMemo, useEffect } from 'react';
import type { Prompt } from './PromptCard';
import { PromptCard } from './PromptCard';
import { Search, X } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

interface PinterestGalleryProps {
  initialPrompts: Prompt[];
  hideFilters?: boolean;
}

const CATEGORIES = ['All', 'Boys', 'Girls', 'Professional', 'AI art', 'Birthday', 'Festivals', 'Posters', 'Netflix typo', 'Memories', 'Anniversary'];
const SORTS = ['Newest', 'Popular', 'A-Z'];

const getIdValue = (id: string | number): number => {
  const str = String(id);
  if (str.startsWith('community-new-')) {
    const num = parseInt(str.replace('community-new-', ''), 10);
    return 20000 + (isNaN(num) ? 0 : num);
  }
  if (str.startsWith('new-')) {
    const num = parseInt(str.replace('new-', ''), 10);
    return 10000 + (isNaN(num) ? 0 : num);
  }
  const num = parseInt(str, 10);
  return isNaN(num) ? 0 : num;
};

export const PinterestGallery: React.FC<PinterestGalleryProps> = ({ initialPrompts, hideFilters = false }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const cat = params.get('category');
      if (q) setSearchQuery(q);
      if (cat) {
        const matched = CATEGORIES.find(c => c.toLowerCase() === cat.toLowerCase());
        if (matched) setActiveCategory(matched);
      }
    }
  }, []);

  const filteredPrompts = useMemo(() => {
    const uniquePrompts = Array.from(new Map(initialPrompts.map(p => [p.id, p])).values());
    let result = uniquePrompts.filter(p => p.image_url);

    if (activeCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.prompt_text.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    if (activeSort === 'Newest') {
      result = result.sort((a, b) => getIdValue(b.id) - getIdValue(a.id));
    } else if (activeSort === 'Popular') {
      result = result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (activeSort === 'A-Z') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialPrompts, activeCategory, activeSort, searchQuery]);

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Search Bar */}
      {!hideFilters && (
        <div className="glass-card !rounded-full flex items-center px-5 py-3.5 w-full sticky top-[72px] z-40 !bg-[var(--color-bg-elevated)]">
          <Search size={20} className="text-[var(--color-text-muted)] mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search viral trends by aesthetic, style, or tag..." 
            aria-label="Search trends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-[14px] font-medium text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] font-[Epilogue]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors p-1 cursor-pointer"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
      )}

      {/* Filters & Sort */}
      {!hideFilters && (
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1 w-full sm:w-auto">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
                className={`badge-pill whitespace-nowrap shrink-0 cursor-pointer transition-all duration-200 ${
                  activeCategory === cat 
                    ? 'badge-pill--active' 
                    : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-[Epilogue]">Sort:</span>
            <div className="flex gap-1.5">
              {SORTS.map(sort => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  aria-pressed={activeSort === sort}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 cursor-pointer font-[Epilogue] ${
                    activeSort === sort
                      ? 'bg-[var(--color-primary)] text-white shadow-[0_2px_8px_var(--color-primary-glow)]'
                      : 'bg-[var(--color-bg-surface)] text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {filteredPrompts.length > 0 ? (
          <div className="w-full columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {filteredPrompts.map((prompt, globalIndex) => {
              const showAd = !hideFilters && globalIndex > 0 && globalIndex % 8 === 0;
              return (
                <React.Fragment key={prompt.id}>
                  <PromptCard prompt={prompt} index={globalIndex} />
                  {showAd && (
                    <div className="w-full relative break-inside-avoid mb-4">
                      <AdSlot type="medium-rectangle" className="w-full aspect-[4/5] h-auto rounded-2xl overflow-hidden" label="Sponsor" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] glass-card w-full">
            <Search size={40} className="text-[var(--color-text-muted)] mb-4 opacity-40" />
            <h3 className="text-[20px] font-[Anton] uppercase text-[var(--color-text)]">No trends found</h3>
            <p className="text-[var(--color-text-muted)] text-[14px] font-[Epilogue] mt-1">Try adjusting your search or filters.</p>
            {searchQuery && (
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-4 px-4 py-2 rounded-full bg-[var(--color-primary-surface)] text-[var(--color-primary)] text-[13px] font-semibold border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/20 transition-all cursor-pointer font-[Epilogue]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
