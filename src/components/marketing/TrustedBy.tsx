import React from 'react';

const TRUSTED_CATEGORIES = [
  'Fortune 500 Companies',
  'Top Universities',
  'Creative Agencies',
  'SaaS Startups',
  'Enterprise Teams',
  'AI Researchers',
];

export const TrustedBy: React.FC = () => {
  return (
    <div className="w-full mt-16 pt-8 border-t border-white/[0.03]">
      <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-6 font-mono text-center">
        Trusted by teams at leading organizations
      </p>
      
      {/* Category tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-[700px] mx-auto px-4">
        {TRUSTED_CATEGORIES.map((category) => (
          <div
            key={category}
            className="px-4 py-2 rounded-full border border-white/[0.06] bg-white/[0.02] text-[12px] font-semibold text-white/30 tracking-tight whitespace-nowrap"
          >
            {category}
          </div>
        ))}
      </div>
    </div>
  );
};
