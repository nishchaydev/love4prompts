import React, { useState } from 'react';
import { ArrowRight, Loader2, Info } from 'lucide-react';
import { Button } from '../ui/Button';

const InstagramIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export const ReelSubmitForm: React.FC = () => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('instagram.com/reel/')) {
      setStatus('error');
      return;
    }

    setStatus('submitting');
    // Phase 1 mock implementation
    setTimeout(() => {
      setStatus('success');
      setUrl('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <div className="bg-[var(--color-background-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8">
      <div className="flex items-start sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] flex items-center justify-center shrink-0 shadow-lg">
          <InstagramIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Import from Instagram</h2>
          <p className="text-[var(--color-text-secondary)] text-sm">
            Paste a reel URL to automatically extract the hidden prompt.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="https://www.instagram.com/reel/..."
          className={`w-full bg-[var(--color-background-elevated)] border ${status === 'error' ? 'border-[var(--color-accent-coral)]' : 'border-[var(--color-border)]'} rounded-xl pl-4 pr-32 py-4 text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent-teal)] transition-colors`}
        />
        <div className="absolute right-2 top-2 bottom-2">
          <Button 
            type="submit" 
            disabled={status === 'submitting' || !url}
            className="h-full px-6 rounded-lg"
          >
            {status === 'submitting' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2">
                Extract <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>

      {status === 'error' && (
        <p className="text-[var(--color-accent-coral)] text-sm mt-3 flex items-center gap-1.5">
          <Info className="w-4 h-4" /> Please enter a valid Instagram Reel URL
        </p>
      )}
      
      {status === 'success' && (
        <p className="text-[var(--color-success-green)] text-sm mt-3 flex items-center gap-1.5">
          <Info className="w-4 h-4" /> Request submitted! Check your library soon.
        </p>
      )}
      
      <div className="mt-6 p-4 bg-[var(--color-accent-teal)]/5 border border-[var(--color-accent-teal)]/20 rounded-xl">
        <h4 className="text-sm font-medium text-[var(--color-accent-teal)] mb-1">How it works (Coming soon in Phase 2)</h4>
        <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
          Our bot will automatically comment on the creator's reel using your connected account, wait for the DM response, extract the prompt text, and save it directly to your library.
        </p>
      </div>
    </div>
  );
};
