import React, { useState, useMemo, useEffect } from 'react';
import type { Prompt } from './PromptCard';
import { Search, SlidersHorizontal, Sparkles, Eye, Bookmark, Flame, X } from 'lucide-react';
import { AdSlot } from '../ads/AdSlot';

interface PinterestGalleryProps {
  initialPrompts: Prompt[];
  hideFilters?: boolean;
}

// Exactly the 10 categories requested by the user + 'All'
const CATEGORIES = ['All', 'Boys', 'Girls', 'Professional', 'AI art', 'Birthday', 'Festivals', 'Posters', 'Netflix typo', 'Memories', 'Anniversary'];
const SORTS = ['Newest', 'Popular', 'A-Z'];

// Helper to parse IDs so newest/highest IDs are sorted correctly
const getIdValue = (id: string | number): number => {
  const str = String(id);
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
      if (q) {
        setSearchQuery(q);
      }
      if (cat) {
        // Find matching category (case-insensitive)
        const matched = CATEGORIES.find(c => c.toLowerCase() === cat.toLowerCase());
        if (matched) {
          setActiveCategory(matched);
        }
      }
    }
  }, []);

  // Derived state with newest first sorting by default
  const filteredPrompts = useMemo(() => {
    // Deduplicate by ID
    const uniquePrompts = Array.from(new Map(initialPrompts.map(p => [p.id, p])).values());
    let result = uniquePrompts.filter(p => p.image_url);

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category?.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.prompt_text.toLowerCase().includes(q) ||
        p.subcategory?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // Sorting logic
    if (activeSort === 'Newest') {
      result = result.sort((a, b) => getIdValue(b.id) - getIdValue(a.id));
    } else if (activeSort === 'Popular') {
      result = result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    } else if (activeSort === 'A-Z') {
      result = result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [initialPrompts, activeCategory, activeSort, searchQuery]);

  const [columnsCount, setColumnsCount] = useState(5);

  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth >= 1280) setColumnsCount(5);
      else if (window.innerWidth >= 1024) setColumnsCount(4);
      else if (window.innerWidth >= 768) setColumnsCount(3);
      else if (window.innerWidth >= 640) setColumnsCount(2);
      else setColumnsCount(1);
    };
    if (typeof window !== 'undefined') {
      updateColumns();
      window.addEventListener('resize', updateColumns);
      return () => window.removeEventListener('resize', updateColumns);
    }
  }, []);

  const masonryColumns = useMemo(() => {
    const cols: Prompt[][] = Array.from({ length: columnsCount }, () => []);
    filteredPrompts.forEach((prompt, index) => {
      cols[index % columnsCount].push(prompt);
    });
    return cols;
  }, [filteredPrompts, columnsCount]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          animation: marquee 30s linear infinite;
        }
      `}} />

      {/* Live Scrolling Ticker to look like a true live trending feed */}
      <div className="w-full bg-[#FFD166] border-4 border-black py-2.5 overflow-hidden relative z-30 rounded-[16px] shadow-[4px_4px_0_#000] select-none">
        <div className="flex whitespace-nowrap animate-marquee-slow font-black uppercase tracking-wider text-black text-[12px] sm:text-xs">
          <span className="flex items-center gap-1.5 shrink-0">
            <Flame size={14} className="fill-current" /> LIVE TRENDS FEED • UPDATED MINUTES AGO • RECREATE VIRAL STYLES INSTANTLY WITH UPLOADED IMAGE • MULTIPLE AI MODELS SUPPORTED • &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Flame size={14} className="fill-current" /> LIVE TRENDS FEED • UPDATED MINUTES AGO • RECREATE VIRAL STYLES INSTANTLY WITH UPLOADED IMAGE • MULTIPLE AI MODELS SUPPORTED • &nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </div>
      </div>

      {/* Search Bar */}
      {!hideFilters && (
        <div className="bg-white border-4 border-black rounded-full shadow-[6px_6px_0_#000] flex items-center px-6 py-4 w-full sticky top-[20px] md:top-[90px] z-40">
          <Search size={24} className="text-[#FF6D87] mr-4" />
          <input 
            type="text" 
            placeholder="Search viral trends by aesthetic, style, or tag..." 
            aria-label="Search trends"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none font-black uppercase tracking-tight text-[16px] sm:text-[18px] placeholder:text-[#ccc] text-black"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="text-gray-400 hover:text-black transition-colors focus:outline-none p-1 cursor-pointer"
              aria-label="Clear search query"
            >
              <X size={20} />
            </button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-8 w-full mt-4">
        {/* Top Filters & Sorting */}
        {!hideFilters && (
          <div className="w-full flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between bg-white border-4 border-black shadow-[8px_8px_0_#FF6D87] p-4 lg:p-6 rounded-[24px] z-30 relative">
             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full xl:w-auto overflow-hidden">
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal size={20} />
                  <span className="font-black uppercase tracking-tighter text-[18px]">Filters</span>
                </div>
                <div className="h-8 w-1 bg-gray-200 mx-2 shrink-0 hidden sm:block"></div>
                <div className="flex flex-row overflow-x-auto gap-2 pb-2 sm:pb-0 custom-scrollbar w-full sm:w-auto">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      aria-pressed={activeCategory === cat}
                      className={`px-4 py-2 rounded-full border-2 transition-all font-black uppercase text-[12px] tracking-wide whitespace-nowrap shrink-0 ${
                        activeCategory === cat 
                          ? 'bg-black text-white border-black shadow-[2px_2px_0_#FF6D87] -translate-y-[1px]' 
                          : 'bg-white text-black border-transparent hover:border-black'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
             </div>
             
             <div className="flex items-center gap-4 shrink-0 w-full xl:w-auto pt-4 xl:pt-0 border-t-2 xl:border-t-0 border-gray-100">
                <span className="font-black text-xs uppercase tracking-widest text-gray-400 shrink-0">Sort By:</span>
                <div className="flex flex-wrap gap-2">
                  {SORTS.map(sort => (
                    <button
                      key={sort}
                      onClick={() => setActiveSort(sort)}
                      aria-pressed={activeSort === sort}
                      className={`px-3 py-1.5 border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeSort === sort
                          ? 'border-[#FF6D87] bg-[#FF6D87] text-white shadow-[3px_3px_0_#000] -translate-y-[1px]'
                          : 'border-black bg-white text-black hover:bg-[#f2f2f2]'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
             </div>
          </div>
        )}

        {/* Main Gallery Area */}
        <div className="flex-1 flex flex-col w-full min-w-0">
          {filteredPrompts.length > 0 ? (
            <div className="flex gap-8 w-full">
              {masonryColumns.map((col, colIndex) => (
                <div key={colIndex} className="flex-1 flex flex-col gap-8 min-w-0">
                  {/* Sponsor Box as first item in the first column */}
                  {colIndex === 0 && !hideFilters && (
                    <div className="w-full bg-[#FAEFED] border-4 border-black h-[220px] rounded-[24px] flex flex-col items-center justify-center text-center p-6 relative overflow-hidden group shadow-[6px_6px_0_#000]">
                      <div className="absolute top-2 right-4 font-black uppercase tracking-widest text-[9px] text-[#FF6D87]">SPONSOR</div>
                      <Sparkles size={28} className="text-[#FF6D87] mb-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                      <h4 className="font-black text-sm uppercase tracking-wider text-black mb-1">Overlay Extension</h4>
                      <p className="text-[11px] text-gray-600 leading-snug">Run Love4Prompts on top of any AI website with our overlay.</p>
                      <a href="/extension" className="mt-4 px-4 py-1.5 bg-black text-white text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-full shadow-[2px_2px_0_#FF6D87] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all">
                        Install overlay
                      </a>
                    </div>
                  )}
                  
                  {col.map((prompt) => {
                    const globalIndex = filteredPrompts.findIndex(p => p.id === prompt.id);
                    const showAd = !hideFilters && globalIndex > 0 && globalIndex % 8 === 0;
                    
                    const isNew = String(prompt.id).startsWith('new-');
                    const isVeryPopular = (prompt.view_count || 0) > 1800;

                    return (
                      <React.Fragment key={prompt.id}>
                        <div className="w-full relative group bg-white border-4 border-black rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[10px_10px_0_#FF6D87] hover:-translate-y-1">
                          <a href={`/prompt/${prompt.slug}`} className="block w-full h-full flex flex-col relative">
                            <div className="relative w-full h-auto overflow-hidden">
                              <img
                                alt={prompt.title}
                                className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-[1.03] min-h-[200px]"
                                src={prompt.image_url || undefined}
                                loading={globalIndex < 6 ? "eager" : "lazy"}
                                fetchPriority={globalIndex < 6 ? "high" : "auto"}
                              />
                              
                              {/* Live Ticker Status Badge */}
                              {isNew && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white border-2 border-black px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0_#000] z-20">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                                  NEW
                                </div>
                              )}
                              {!isNew && isVeryPopular && (
                                <div className="absolute top-3 left-3 bg-[#FF6D87] text-white border-2 border-black px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1 shadow-[2px_2px_0_#000] z-20">
                                  🔥 HOT
                                </div>
                              )}
                            </div>
                            
                            {/* Premium details block */}
                            <div className="p-4 border-t-2 border-black bg-white flex flex-col gap-2">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-black uppercase text-[14px] sm:text-[15px] text-black tracking-tight leading-tight group-hover:text-[#FF6D87] transition-colors line-clamp-1">{prompt.title}</h4>
                                <span className="shrink-0 bg-[#FF6D87]/15 text-[#FF6D87] px-2 py-0.5 rounded-full text-[9px] font-black border border-[#FF6D87] uppercase tracking-wider">
                                  {prompt.category}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                <div className="flex items-center gap-3 text-gray-500 font-black text-[10px] uppercase tracking-wider">
                                  <span className="flex items-center gap-1">
                                    <Eye size={12} /> {prompt.view_count != null && Number.isFinite(Number(prompt.view_count)) ? Number(prompt.view_count).toLocaleString() : "—"}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Bookmark size={12} /> {prompt.save_count != null && Number.isFinite(Number(prompt.save_count)) ? Number(prompt.save_count).toLocaleString() : "—"}
                                  </span>
                                </div>
                                <span className="text-[11px] font-black uppercase text-black group-hover:text-[#1482A3] transition-colors flex items-center gap-1">
                                  Create Me →
                                </span>
                              </div>
                            </div>
                          </a>
                        </div>
                        {showAd && (
                          <div className="w-full relative group">
                            <AdSlot type="medium-rectangle" className="w-full aspect-[4/5] h-auto rounded-[24px] overflow-hidden" label="Sponsor" />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] border-4 border-black border-dashed rounded-[32px] bg-white/50 w-full">
              <Search size={48} className="text-[#ccc] mb-4" />
              <h3 className="text-[24px] font-black uppercase text-black">No prompts found</h3>
              <p className="text-[#888]">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
