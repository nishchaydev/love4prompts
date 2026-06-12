import React, { useState, useMemo, useEffect } from 'react';
import type { Prompt } from './PromptCard';
import { Search, SlidersHorizontal, ArrowDownAZ, Star, Sparkles } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

interface PinterestGalleryProps {
  initialPrompts: Prompt[];
}

const CATEGORIES = ['All', 'Boys', 'Girls', 'Cinematic', 'Photography', 'Illustration', '3D Render', 'Abstract', 'Portrait', 'Graphic Design'];
const SORTS = ['Newest', 'Popular', 'A-Z'];

export const PinterestGallery: React.FC<PinterestGalleryProps> = ({ initialPrompts }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeSort, setActiveSort] = useState('Newest');
  const [searchQuery, setSearchQuery] = useState('');
  // Window resize listener removed for CSS-only masonry

  // Derived state
  const filteredPrompts = useMemo(() => {
    let result = initialPrompts.filter(p => p.image_url);

    // Category filter
    if (activeCategory !== 'All') {
      if (activeCategory === 'Boys') {
        result = result.filter(p => /\b(boy|man|male|guy|gentleman|men|boys)\b/i.test(p.prompt_text));
      } else if (activeCategory === 'Girls') {
        result = result.filter(p => /\b(girl|woman|female|lady|women|girls)\b/i.test(p.prompt_text));
      } else {
        result = result.filter(p => p.style?.toLowerCase() === activeCategory.toLowerCase());
      }
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.prompt_text.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (activeSort === 'Newest') {
      const safeGetTimestamp = (dateStr: any) => {
        const ts = new Date(dateStr || 0).getTime();
        return isNaN(ts) ? 0 : ts;
      };
      result = result.sort((a, b) => safeGetTimestamp(b.created_at) - safeGetTimestamp(a.created_at));
    } else if (activeSort === 'A-Z') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialPrompts, activeCategory, activeSort, searchQuery]);

  const accentColors = ['#FF3B30', '#0047BB', '#000000', '#FF6D87'];


  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1400px] mx-auto items-start">
      
      {/* Left Sidebar - Filters & Sorting */}
      <aside className="w-full md:w-[260px] shrink-0 md:sticky md:top-[120px] flex flex-col gap-8">
        
        {/* Sorting & Filters Block */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0_#FF6D87] p-[24px] rounded-[24px]">
          <h3 className="font-black uppercase tracking-tighter text-[24px] mb-6 flex items-center gap-2">
            <SlidersHorizontal size={24} /> Filters
          </h3>
          
          <div className="mb-6">
            <h4 className="ed-label-caps text-[#4c4546] mb-3">Categories</h4>
            <div className="flex flex-row overflow-x-auto md:flex-col gap-2 pb-2 md:pb-0 custom-scrollbar">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  className={`text-left px-4 py-2 rounded-full border-2 transition-all font-bold text-[14px] whitespace-nowrap shrink-0 ${
                    activeCategory === cat 
                      ? 'bg-black text-white border-black' 
                      : 'bg-white text-black border-transparent hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="ed-label-caps text-[#4c4546] mb-3 flex items-center gap-2">
              <ArrowDownAZ size={16} /> Sort By
            </h4>
            <div className="flex flex-wrap gap-2">
              {SORTS.map(sort => (
                <button
                  key={sort}
                  onClick={() => setActiveSort(sort)}
                  aria-pressed={activeSort === sort}
                  className={`px-4 py-2 border-2 text-[12px] font-bold uppercase tracking-widest transition-all ${
                    activeSort === sort
                      ? 'border-[#FF6D87] bg-[#FF6D87] text-white shadow-[4px_4px_0_#000]'
                      : 'border-black bg-white text-black hover:bg-[#f2f2f2]'
                  }`}
                >
                  {sort}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advertisement Section */}
        <div className="hidden md:flex bg-[#f2f2f2] border-2 border-dashed border-[#ccc] h-[250px] rounded-[24px] flex-col items-center justify-center text-center p-6 relative overflow-hidden group">
          <div className="absolute top-2 right-4 ed-label-caps text-[#888] text-[10px]">AD</div>
          <Sparkles size={32} className="text-[#FF6D87] mb-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          <h4 className="font-bold text-[16px] mb-2 text-[#4c4546]">Sponsor Space</h4>
          <p className="text-[12px] text-[#888]">Your ad could be placed right here.</p>
        </div>
      </aside>

      {/* Main Gallery Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Pinterest-style Top Search Bar */}
        <div className="bg-white border-4 border-black rounded-full shadow-[6px_6px_0_#000] flex items-center px-6 py-4 mb-8 w-full sticky top-[90px] z-40">
          <Search size={24} className="text-[#FF6D87] mr-4" />
          <input 
            type="text" 
            placeholder="Search amazing prompts..." 
            aria-label="Search prompts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-medium text-[18px] placeholder:text-[#ccc] text-black"
          />
        </div>

        {/* Masonry Grid */}
        {filteredPrompts.length > 0 ? (
          <div className="columns-2 lg:columns-3 xl:columns-4 gap-6 w-full">
            {filteredPrompts.map((prompt, i) => {
              const showAd = i > 0 && i % 7 === 0;
              return (
                <React.Fragment key={prompt.id}>
                  <div className="break-inside-avoid inline-block w-full mb-6 relative group bg-white border-4 border-black rounded-[24px] overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[12px_12px_0_#FF6D87]">
                    <a href={`/prompt/${prompt.slug}`} className="block w-full h-full flex flex-col relative">
                      <div className="relative w-full h-auto">
                        <img
                          alt={prompt.title}
                          className="w-full h-auto object-cover block"
                          src={prompt.image_url || undefined}
                          loading={i < 8 ? "eager" : "lazy"}
                          fetchPriority={i < 8 ? "high" : "auto"}
                        />
                        
                        {/* Hover Overlay (Desktop) */}
                        <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-[16px] flex-col justify-between pointer-events-none group-hover:pointer-events-auto">
                          <div className="flex justify-between items-start">
                            <span className="bg-white text-black px-3 py-1 rounded-full text-[12px] font-bold shadow-[4px_4px_0_#FF6D87] border-2 border-black">
                              {prompt.style || 'Prompt'}
                            </span>
                            <button className="bg-[#FF6D87] text-white w-[40px] h-[40px] rounded-full flex items-center justify-center border-2 border-black shadow-[4px_4px_0_#000] hover:bg-black transition-colors">
                              <Star size={16} />
                            </button>
                          </div>
                          
                          <div className="bg-white border-2 border-black p-3 rounded-xl shadow-[4px_4px_0_#FF6D87] translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <h4 className="font-black uppercase text-[14px] line-clamp-1 mb-1">{prompt.title}</h4>
                            <p className="text-[12px] text-[#4c4546] line-clamp-2">
                              {prompt.prompt_text}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Mobile Details Bar */}
                      <div className="md:hidden bg-white border-t-2 border-black p-3 flex flex-col gap-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-black uppercase text-[12px] line-clamp-1 leading-tight">{prompt.title}</h4>
                          <span className="shrink-0 bg-[#FF6D87] text-white px-2 py-0.5 rounded-full text-[8px] font-bold border border-black">
                            {prompt.style || 'PROMPT'}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#4c4546] line-clamp-1 leading-tight">
                          {prompt.prompt_text}
                        </p>
                      </div>
                    </a>
                  </div>
                  {showAd && (
                    <div className="w-full relative group break-inside-avoid mb-6 inline-block">
                      <AdSlot type="medium-rectangle" className="w-full aspect-[4/5] h-auto rounded-[24px] overflow-hidden" label="Sponsor" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] border-4 border-black border-dashed rounded-[32px] bg-white/50">
            <Search size={48} className="text-[#ccc] mb-4" />
            <h3 className="text-[24px] font-black uppercase text-black">No prompts found</h3>
            <p className="text-[#888]">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};
