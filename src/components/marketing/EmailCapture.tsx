import React, { useState } from 'react';

declare global {
  interface Window {
    clarity?: (method: string, event: string, data?: Record<string, string>) => void;
  }
}

export const EmailCapture: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/email-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setEmail('');
      
      // Track successful signup in Microsoft Clarity
      window.clarity?.("event", "email_captured");
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to subscribe.');
    }
  };

  return (
    <div className="w-full max-w-[720px] mx-auto px-4 mb-12 relative z-10">
      <div className="bg-[var(--color-primary-surface)] border border-[var(--color-border-warm)] rounded-2xl p-6 sm:p-7 flex flex-col gap-3 relative overflow-hidden backdrop-blur-md">
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center text-center py-4 animate-fade-in">
            <span className="text-base sm:text-lg font-bold text-[#10b981] flex items-center gap-2">
              ✓ You're in! First batch drops Monday.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              {/* Left Column: Headline */}
              <div className="flex-1 text-left">
                <h3 className="text-[14.5px] sm:text-base font-semibold text-white tracking-tight leading-snug">
                  Get 5 prompt ideas for your niche, every Monday. Free.
                </h3>
              </div>

              {/* Right Column: Input + Button */}
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 items-stretch min-w-[280px] sm:min-w-[320px]">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  className="flex-1 px-3.5 py-2 rounded-xl text-sm bg-white/[0.04] border border-white/[0.08] text-white placeholder-white/30 focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-lg shadow-[var(--color-primary-glow)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  {status === 'loading' ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    'Send me prompts'
                  )}
                </button>
              </div>
            </div>

            {/* Bottom Disclaimer & Error */}
            <div className="flex flex-col gap-1 text-left">
              <span className="text-[10px] text-white/35 font-medium tracking-wide">
                No spam. Unsubscribe anytime.
              </span>
              {status === 'error' && (
                <span className="text-xs text-red-400 font-semibold mt-1">
                  {errorMessage}
                </span>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
