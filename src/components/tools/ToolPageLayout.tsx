import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getRemainingUses, DAILY_LIMIT, getUsageCount } from '../../lib/rate-limit';

interface ToolPageLayoutProps {
  toolName: string;
  toolSlug: string;
  title: string;
  description: string;
  accentColor: string;
  children: React.ReactNode;
}

export const ToolPageLayout: React.FC<ToolPageLayoutProps> = ({
  toolName,
  toolSlug,
  title,
  description,
  accentColor,
  children,
}) => {
  const remaining = getRemainingUses(toolSlug);
  const used = getUsageCount(toolSlug);

  return (
    <div className="pt-[100px] pb-20 px-4">
      <div className="container mx-auto max-w-[720px]">
        {/* Back link */}
        <a
          href="/tools"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors mb-8 no-underline group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          All Tools
        </a>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-[var(--color-text-secondary)] text-base leading-relaxed max-w-[560px]">
            {description}
          </p>
        </div>

        {/* Rate limit counter */}
        <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-[var(--color-background-card)] border border-white/[0.06]">
          <div className="flex gap-1">
            {Array.from({ length: DAILY_LIMIT }).map((_, i) => (
              <div
                key={i}
                className="w-2.5 h-2.5 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor: i < used
                    ? 'var(--color-text-muted)'
                    : accentColor,
                  opacity: i < used ? 0.3 : 1,
                  boxShadow: i >= used ? `0 0 8px ${accentColor}40` : 'none',
                }}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            {remaining > 0
              ? `${used} of ${DAILY_LIMIT} free uses today`
              : 'Daily limit reached — resets tomorrow'}
          </span>
        </div>

        {/* Tool content */}
        {children}
      </div>
    </div>
  );
};
