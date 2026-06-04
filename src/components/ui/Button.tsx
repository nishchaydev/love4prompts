import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-[700] transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#435ee5] disabled:bg-[#f6f6f3] disabled:text-[#91918c] disabled:pointer-events-none";
    
    const variants = {
      primary: "bg-[#e60023] text-white hover:bg-[#cc001f] rounded-[16px]",
      secondary: "bg-[#e5e5e0] text-[#000000] hover:bg-[#c8c8c1] rounded-[16px]",
      tertiary: "bg-transparent text-[#000000] hover:bg-[#f6f6f3] rounded-[16px]",
      'icon-circular': "bg-[#f6f6f3] text-[#000000] hover:bg-[#e5e5e0] rounded-full",
      'pill-on-image': "bg-white text-[#000000] hover:bg-[#f6f6f3] rounded-full"
    };

    const sizes = {
      sm: "h-[32px] px-3 text-[12px]",
      md: "h-[40px] px-[14px] text-[14px]",
      lg: "h-[48px] px-6 text-[16px]",
      icon: "h-[40px] w-[40px]"
    };

    const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

    return (
      <button ref={ref} className={classes} {...props} />
    );
  }
);

Button.displayName = 'Button';
