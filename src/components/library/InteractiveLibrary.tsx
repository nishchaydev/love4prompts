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
    <div className="flex flex-col md:flex-row gap-8 relative">
      {/* Sidebar Filters */}
      <div className="w-full md:w-[240px] md:shrink-0 sticky top-[72px] z-30 bg-white/95 backdrop-blur-xl md:bg-transparent md:backdrop-blur-none py-4 md:py-0 md:h-[calc(100vh-100px)] md:overflow-y-auto scrollbar-hide border-b md:border-b-0 md:border-r border-gray-100 mb-6 md:mb-0">
        <div className="md:pr-6">
          <h3 className="hidden md:block font-bold text-gray-900 mb-4 px-2 tracking-wide uppercase text-xs">Categories</h3>
          <CategoryFilter 
            categories={styles} 
            selectedCategory={selectedCategory} 
            onSelect={setSelectedCategory} 
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 min-w-0 pb-12">
        <MasonryGrid prompts={filteredPrompts} />
      </div>
    </div>
  );
};
