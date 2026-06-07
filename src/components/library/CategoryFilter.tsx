import React from 'react';
import { Sparkles, Camera, Image as ImageIcon, Smile, Sun, Moon, Cpu, Coffee, Star, Palmtree } from 'lucide-react';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

const getCategoryIcon = (category: string) => {
  const iconProps = { className: "w-4 h-4 mr-2" };
  switch(category.toLowerCase()) {
    case 'cyberpunk':
    case 'sci-fi':
      return <Cpu {...iconProps} />;
    case 'photography':
    case 'macro':
      return <Camera {...iconProps} />;
    case 'art':
    case 'illustration':
    case '3d':
    case 'pixelart':
      return <ImageIcon {...iconProps} />;
    case 'cute':
    case 'character':
      return <Smile {...iconProps} />;
    case 'food':
    case 'burger':
      return <Coffee {...iconProps} />;
    case 'nature':
    case 'landscape':
      return <Sun {...iconProps} />;
    case 'night':
      return <Moon {...iconProps} />;
    case 'all':
      return <Star {...iconProps} />;
    case 'travel':
      return <Palmtree {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};

export const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelect }) => {
  return (
    <div className="flex items-center gap-2 w-full overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect('All')}
        className={`whitespace-nowrap flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
          selectedCategory === 'All' 
            ? 'bg-[var(--color-primary)] text-white shadow-[0_0_15px_var(--color-primary-glow)]' 
            : 'bg-[var(--color-background-elevated)] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
        }`}
      >
        {getCategoryIcon('All')}
        All
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`whitespace-nowrap flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
            selectedCategory === category 
              ? 'bg-[var(--color-primary)] text-white shadow-[0_0_15px_var(--color-primary-glow)]' 
              : 'bg-[var(--color-background-elevated)] text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          {getCategoryIcon(category)}
          {category}
        </button>
      ))}
    </div>
  );
};
