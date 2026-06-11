import React, { useState } from 'react';
import { 
  ThumbsUp, MessageSquare, Repeat2, Send, Loader2, Copy, Check, RotateCcw 
} from 'lucide-react';

export const LinkedInPostGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Storytelling');
  const [hookStyle, setHookStyle] = useState('Personal Story');
  const [includeCTA, setIncludeCTA] = useState(true);
  
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate post handler
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (topic.trim().length < 10) {
      setError('Please describe your topic in a bit more detail (minimum 10 characters).');
      return;
    }
    if (loading) return;

    setLoading(true);
    setError('');
    setOutput('');

    try {
      const res = await fetch('/api/tools/linkedin-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, hookStyle, includeCTA }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate LinkedIn post.');
      }

      setOutput(data.post || '');
      
      // Clarity Event Tracking
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'linkedin_post_generated');
      }
    } catch (err: any) {
      console.error('LinkedIn generator error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy post handler
  const handleCopy = () => {
    if (!output) return;

    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      // Clarity Event Tracking
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'linkedin_post_copied');
      }
    }).catch((err) => {
      console.warn('Copy failed, using fallback:', err);
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = output;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    });
  };

  // Character count color coding
  const getCharCountColor = (count: number) => {
    if (count < 2500) return 'text-[var(--color-success-green)]';
    if (count <= 2900) return 'text-[var(--color-warning-amber)]';
    return 'text-red-500';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 relative z-10">
      {/* Skeleton Shimmer CSS Keyframe Injection */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .skeleton-shimmer-line {
          background: linear-gradient(90deg, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.02) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.6s infinite linear;
        }
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: INPUTS */}
        <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-3xl p-6 flex flex-col gap-6">
          <form onSubmit={handleGenerate} className="flex flex-col gap-6">
            
            {/* Topic text area */}
            <div className="flex flex-col gap-2.5">
              <label htmlFor="topic-input" className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                What do you want to post about?
              </label>
              <textarea
                id="topic-input"
                value={topic}
                onChange={(e) => setTopic(e.target.value.slice(0, 500))}
                rows={4}
                maxLength={500}
                placeholder="e.g. I just launched my first product after 6 months of nights and weekends..."
                disabled={loading}
                className="w-full bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-4 text-[13.5px] text-black focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)] focus:border-transparent transition-all placeholder-white/20 resize-none font-medium leading-relaxed"
              />
              <span className="text-[10px] text-black/30 font-mono self-end">
                {topic.length} / 500
              </span>
            </div>

            {/* Tone selector */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Tone
              </span>
              <div className="grid grid-cols-2 gap-2">
                {['Professional', 'Storytelling', 'Thought Leadership', 'Casual'].map((t) => {
                  const isActive = tone === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTone(t)}
                      disabled={loading}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-primary)] text-black shadow-[0_0_15px_var(--color-primary-glow)] scale-[1.02]'
                          : 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black text-black/60 hover:text-black hover:border-black/20 border-[2px]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Hook Style selector */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                Hook Style
              </span>
              <div className="grid grid-cols-3 gap-2">
                {['Question', 'Bold Statement', 'Personal Story'].map((h) => {
                  const isActive = hookStyle === h;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHookStyle(h)}
                      disabled={loading}
                      className={`py-2.5 px-1 text-center rounded-xl text-[11px] font-semibold tracking-tight transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[var(--color-primary)] text-black shadow-[0_0_15px_var(--color-primary-glow)] scale-[1.02]'
                          : 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black text-black/60 hover:text-black hover:border-black/20 border-[2px]'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* CTA Toggle switch */}
            <div className="flex items-center justify-between bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] border-[3px] border-black p-4 rounded-2xl">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-black">End with a call to action?</span>
                <span className="text-[10px] text-black/30">Append a call to action at the bottom of the post</span>
              </div>
              <button
                type="button"
                onClick={() => setIncludeCTA(!includeCTA)}
                disabled={loading}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  includeCTA ? 'bg-[var(--color-primary)]' : 'bg-white/15'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    includeCTA ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Generate button */}
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full h-12 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-sm tracking-wide transition-all shadow-[0_4px_25px_var(--color-primary-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  Generating LinkedIn Post...
                </>
              ) : (
                'Generate LinkedIn Post'
              )}
            </button>

          </form>
        </div>

        {/* RIGHT COLUMN: OUTPUT PREVIEW */}
        <div className="flex flex-col gap-5">
          
          {/* LinkedIn Mockup Card */}
          <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
            
            {/* Header row */}
            <div className="flex items-center gap-3 border-b border-white/[0.04] pb-3.5">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary-surface)] border border-[var(--color-border-warm)] text-[var(--color-primary)] flex items-center justify-center font-bold font-display text-sm tracking-tight">
                LP
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-bold text-black leading-tight">Your Name</span>
                <span className="text-[11px] text-black/40 leading-tight">Your Headline &bull; Just now</span>
              </div>
            </div>

            {/* Post body */}
            <div className="min-h-[200px] text-sm text-black font-bold leading-relaxed whitespace-pre-wrap select-text py-1">
              {loading ? (
                // Shimmer state
                <div className="flex flex-col gap-3.5 py-2">
                  <div className="h-4 w-11/12 bg-white/[0.03] rounded skeleton-shimmer-line" />
                  <div className="h-4 w-full bg-white/[0.03] rounded skeleton-shimmer-line" />
                  <div className="h-4 w-5/6 bg-white/[0.03] rounded skeleton-shimmer-line" />
                  <div className="h-4 w-2/3 bg-white/[0.03] rounded skeleton-shimmer-line" />
                </div>
              ) : output ? (
                // Output content
                output
              ) : error ? (
                // Error state inline
                <div className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-4 rounded-xl text-xs leading-relaxed">
                  {error}
                </div>
              ) : (
                // Empty state placeholders
                <div className="flex flex-col gap-5 py-4">
                  <div className="flex flex-col gap-3">
                    <div className="h-3 w-5/6 bg-white/[0.015] rounded skeleton-shimmer-line" />
                    <div className="h-3 w-11/12 bg-white/[0.015] rounded skeleton-shimmer-line" />
                    <div className="h-3 w-3/4 bg-white/[0.015] rounded skeleton-shimmer-line" />
                    <div className="h-3 w-1/2 bg-white/[0.015] rounded skeleton-shimmer-line" />
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] italic text-center mt-3">
                    Your post will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Divider line */}
            <div className="h-px bg-gray-100 border-[2px] border-black" />

            {/* Fake actions row */}
            <div className="flex items-center justify-between px-1 text-black/30 text-xs font-semibold">
              <div className="flex items-center gap-1.5 transition-colors cursor-default">
                <ThumbsUp className="w-4 h-4" />
                <span>Like</span>
              </div>
              <div className="flex items-center gap-1.5 transition-colors cursor-default">
                <MessageSquare className="w-4 h-4" />
                <span>Comment</span>
              </div>
              <div className="flex items-center gap-1.5 transition-colors cursor-default">
                <Repeat2 className="w-4 h-4" />
                <span>Repost</span>
              </div>
              <div className="flex items-center gap-1.5 transition-colors cursor-default">
                <Send className="w-4 h-4" />
                <span>Send</span>
              </div>
            </div>

          </div>

          {/* Under preview controls */}
          {output && !loading && (
            <div className="flex flex-col gap-3.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-mono font-semibold ${getCharCountColor(output.length)}`}>
                  {output.length} / 3000 characters
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Copy Button */}
                <button
                  type="button"
                  onClick={handleCopy}
                  className="h-11 rounded-xl border border-black/20 border-[2px] hover:border-black/30 border-[2px] bg-white/5 hover:bg-[#FF6D87]/20 hover:-translate-y-1 hover:shadow-[4px_4px_0_#FF6D87] transition-all text-black font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.97]"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[var(--color-success-green)] animate-bounce" />
                      Copied ✓
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Post
                    </>
                  )}
                </button>

                {/* Regenerate Button */}
                <button
                  type="button"
                  onClick={() => handleGenerate()}
                  className="h-11 rounded-xl border border-[var(--color-border-warm)] bg-[var(--color-primary-surface)] text-[var(--color-primary)] font-bold text-xs tracking-wide flex items-center justify-center gap-2 hover:bg-[var(--color-primary)]/15 transition-all cursor-pointer active:scale-[0.97]"
                >
                  <RotateCcw className="w-4 h-4" />
                  Regenerate
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
