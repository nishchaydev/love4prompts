import React from 'react';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt = "User avatar", size = 'md', className = '' }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };

  const containerClasses = `relative rounded-full overflow-hidden bg-[var(--color-background-elevated)] flex items-center justify-center border border-[var(--color-border)] ${sizes[size]} ${className}`;

  if (src) {
    return (
      <div className={containerClasses}>
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      <User className="w-1/2 h-1/2 text-[var(--color-text-muted)]" />
    </div>
  );
};
