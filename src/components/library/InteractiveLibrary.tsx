import React, { useState, useMemo } from 'react';
import { CategoryFilter } from './CategoryFilter';
import { MasonryGrid } from './MasonryGrid';
import type { Prompt } from './PromptCard';

interface InteractiveLibraryProps {
  prompts: Prompt[];
  styles: string[];
}

export const InteractiveLibrary: React.FC<InteractiveLibraryProps> = ({ prompts, styles }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'All') return prompts;
    return prompts.filter(p => p.style === selectedCategory);
  }, [prompts, selectedCategory]);

  return (
    <div className="flex flex-col gap-6 relative">
      {/* Horizontal filter bar — sticky below header */}
      <div className="sticky top-[var(--header-height)] z-30 bg-[var(--color-background-primary)]/95 backdrop-blur-xl py-3 -mx-4 px-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          <CategoryFilter
            categories={styles}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="min-w-0 pb-12">
        <MasonryGrid prompts={filteredPrompts} />
      </div>
    </div>
  );
};
