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
    'filter-chip': "bg-[#f6f6f3] text-[#000000] text-[14px] px-[16px] py-[8px]",
    'filter-chip-active': "bg-[#000000] text-[#ffffff] text-[14px] px-[16px] py-[8px]",
    'pin-overlay-pill': "bg-[#ffffff] text-[#000000] text-[12px] px-[12px] py-[6px]",
    default: "bg-[#f6f6f3] text-[#000000] text-[12px] px-[12px] py-[6px]",
    outline: "border border-[#dadad3] text-[#000000] text-[12px] px-[12px] py-[6px]"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};
