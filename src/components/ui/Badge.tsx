import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

export const Badge: React.FC<BadgeProps> = ({ 
  className = '', 
  variant = 'default',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center font-[700] transition-colors rounded-full";
  
  const variants: Record<string, string> = {
    'filter-chip': "bg-white/[0.06] text-white/70 text-[14px] px-[16px] py-[8px]",
    'filter-chip-active': "bg-[var(--color-primary)] text-white text-[14px] px-[16px] py-[8px]",
    'pin-overlay-pill': "bg-white/10 text-white text-[12px] px-[12px] py-[6px]",
    default: "bg-white/[0.06] text-white/70 text-[12px] px-[12px] py-[6px]",
    outline: "border border-white/[0.1] text-white/60 text-[12px] px-[12px] py-[6px]",
    secondary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-[12px] px-[12px] py-[6px] border border-[var(--color-primary)]/20",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};
