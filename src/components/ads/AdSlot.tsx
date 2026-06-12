import React from 'react';

interface AdSlotProps {
  type?: 'leaderboard' | 'medium-rectangle' | 'banner' | 'skyscraper';
  className?: string;
  label?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ 
  type = 'medium-rectangle', 
  className = '', 
  label = 'Advertisement' 
}) => {
  
  // Conditionally load the AdSense script if the ID is provided
  const ADSENSE_ID = import.meta.env.PUBLIC_ADSENSE_ID;

  // Dimensions based on standard ad sizes
  const dimensions = {
    'leaderboard': 'w-full max-w-[728px] h-[90px]',
    'banner': 'w-full max-w-[468px] h-[60px]',
    'medium-rectangle': 'w-[300px] h-[250px]',
    'skyscraper': 'w-[160px] h-[600px]'
  };

  React.useEffect(() => {
    if (!ADSENSE_ID || !/^ca-pub-\d+$/.test(ADSENSE_ID)) return;
    
    // The script is already loaded globally via Layout.astro, but we need to push
    // the initialization for this specific slot.
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error("AdSense error:", e);
    }
  }, [ADSENSE_ID]);

  if (ADSENSE_ID && /^ca-pub-\d+$/.test(ADSENSE_ID)) {
    const safeId = encodeURIComponent(ADSENSE_ID);
    return (
      <div className={`relative ${dimensions[type]} flex items-center justify-center bg-transparent ${className}`}>
        <ins className="adsbygoogle"
             style={{ display: 'block', width: '100%', height: '100%' }}
             data-ad-client={safeId}
             data-ad-slot="auto"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    );
  }

  return (
    <div className={`relative ${dimensions[type]} flex items-center justify-center bg-[#FAEFED] border-[3px] border-black shadow-[6px_6px_0_rgba(0,0,0,1)] ${className}`}>
      
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, #000 1px, transparent 1px),
            linear-gradient(to bottom, #000 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
        }}
      ></div>

      {/* Placeholder Content */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest absolute top-2 right-2">
          {label}
        </span>
        <div className="text-gray-400 font-bold uppercase tracking-widest text-sm transform -rotate-12 select-none">
          Ad Space
        </div>
      </div>
    </div>
  );
};
