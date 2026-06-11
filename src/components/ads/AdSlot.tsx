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
  
  // Dimensions based on standard ad sizes
  const dimensions = {
    'leaderboard': 'w-full max-w-[728px] h-[90px]',
    'banner': 'w-full max-w-[468px] h-[60px]',
    'medium-rectangle': 'w-[300px] h-[250px]',
    'skyscraper': 'w-[160px] h-[600px]'
  };

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
