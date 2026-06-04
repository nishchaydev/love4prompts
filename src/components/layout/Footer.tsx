import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background-card)] py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-[var(--color-text-secondary)] text-sm">
          &copy; {new Date().getFullYear()} ViralPrompt. All rights reserved.
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <a href="/privacy" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Privacy Policy</a>
          <a href="/terms" className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
