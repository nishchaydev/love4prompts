import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center font-[700] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[#0A0118] disabled:bg-white/5 disabled:text-white/20 disabled:pointer-events-none rounded-xl";
    
    const variants = {
      primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-[0_4px_20px_var(--color-primary-glow)]",
      secondary: "bg-white/[0.04] text-white hover:bg-white/[0.08] border border-white/[0.08]",
      outline: "bg-transparent text-white border border-white/[0.12] hover:bg-white/[0.04]",
      ghost: "bg-transparent text-white/60 hover:text-white hover:bg-white/[0.04]",
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

