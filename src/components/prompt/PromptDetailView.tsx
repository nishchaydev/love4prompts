import React, { useState } from 'react';
import type { Prompt } from '../library/PromptCard';
import { mockPrompts } from '../../lib/mock-data';
import { Copy, Check, Bookmark, Share2, Flame, ExternalLink, Wand2, ChevronDown, ChevronUp } from 'lucide-react';

const getOptimizedImageUrlDetail = (url: string | null): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      parsed.searchParams.set('w', '800');
      parsed.searchParams.set('q', '75');
      if (!parsed.searchParams.has('auto')) {
        parsed.searchParams.set('auto', 'format');
      }
      return parsed.toString();
    } catch {
      return url;
    }
  }
  return url;
};

interface PromptDetailViewProps {
  prompt: Prompt;
  initialSaved?: boolean;
}

export const PromptDetailView: React.FC<PromptDetailViewProps> = ({ prompt, initialSaved = false }) => {
  const [copied, setCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const handleCreateClick = async () => {
    setIsRedirecting(true);
    setCountdown(3);
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.prompt_text);
      }
    } catch (err) {
      console.warn('Auto-copy on redirect failed: ', err);
    }
  };

  const handleSkipCountdown = () => {
    setIsRedirecting(false);
    const promptPrefix = "Generate an image using this prompt: ";
    const redirectUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptPrefix + prompt.prompt_text)}`;
    window.open(redirectUrl, '_blank');
  };

  React.useEffect(() => {
    if (!isRedirecting) return;
    if (countdown === 0) {
      setIsRedirecting(false);
      const promptPrefix = "Generate an image using this prompt: ";
      const redirectUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptPrefix + prompt.prompt_text)}`;
      window.open(redirectUrl, '_blank');
      return;
    }
    const timer = setTimeout(() => {
      setCountdown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isRedirecting, countdown, prompt.prompt_text]);

  React.useEffect(() => {
    import('../../lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (session && !initialSaved) {
          supabase
            .from('saved_prompts')
            .select('prompt_id')
            .eq('user_id', session.user.id)
            .eq('prompt_id', prompt.id)
            .single()
            .then(({ data }) => {
              if (data) setIsSaved(true);
            });
        }
      });
    });
  }, [prompt.id, initialSaved]);

  const handleSave = async () => {
    if (!session) {
      window.dispatchEvent(new Event('open-auth-modal'));
      return;
    }
    if (isSaving) return;

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    setIsSaving(true);

    try {
      const { supabase } = await import('../../lib/supabase');
      if (!newSavedState) {
        const { error: deleteError } = await supabase
          .from('saved_prompts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('prompt_id', prompt.id);
        if (deleteError) throw deleteError;
        await supabase.rpc('decrement_save_count', { row_id: prompt.id });
      } else {
        const { error: insertError } = await supabase
          .from('saved_prompts')
          .insert({ user_id: session.user.id, prompt_id: prompt.id });
        if (insertError) throw insertError;
        await supabase.rpc('increment_save_count', { row_id: prompt.id });
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      setIsSaved(!newSavedState);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.prompt_text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = prompt.prompt_text;
        ta.style.cssText = 'position:fixed;left:-9999px;opacity:0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: prompt.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
      }
    } catch {}
  };

  // Group related images by prompt text
  const relatedImages = mockPrompts
    .filter(p => p.prompt_text === prompt.prompt_text && p.image_url)
    .map(p => p.image_url as string);
    
  if (relatedImages.length === 0 && prompt.image_url) {
    relatedImages.push(prompt.image_url);
  }

  const promptPrefix = "Generate an image using this prompt: ";
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptPrefix + prompt.prompt_text)}`;

  return (
    <>
      <main className="flex-grow flex flex-col md:flex-row relative max-w-[1200px] mx-auto w-full px-5 sm:px-8 py-8 md:py-12 gap-8 md:gap-12">

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 relative z-10">
          <div className={`w-full ${relatedImages.length > 1 ? 'columns-2 gap-4' : 'flex justify-center'}`}>
            {relatedImages.length > 0 ? (
              relatedImages.map((img, i) => (
                <div key={i} className="relative w-full rounded-2xl overflow-hidden group bg-[var(--color-bg-surface)] mb-4 break-inside-avoid border border-[var(--color-border)]">
                  <img
                    alt={`${prompt.title} - Image ${i + 1}`}
                    className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
                    src={getOptimizedImageUrlDetail(img)}
                    loading={i === 0 ? "eager" : "lazy"}
                  />
                </div>
              ))
            ) : (
              <div className="w-full aspect-square flex items-center justify-center glass-card">
                <span className="text-[var(--color-text-muted)] text-xs font-mono uppercase tracking-widest">No image available</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Trend Data + Launch */}
        <div className="w-full md:w-1/2 flex flex-col relative z-10">
          {/* Title & Badges */}
          <div className="mb-6">
            <h1 className="font-[Anton] uppercase text-[var(--color-text)] text-[32px] sm:text-[40px] md:text-[48px] leading-[1.0] mb-4">
              {prompt.title}
            </h1>
            <div className="flex flex-wrap gap-2">
              {prompt.category && (
                <span className="badge-pill badge-pill--active">{prompt.category}</span>
              )}
              {prompt.subcategory && (
                <span className="badge-pill">{prompt.subcategory}</span>
              )}
              {prompt.model && (
                <span className="badge-pill !border-[var(--color-accent)]/30 !text-[var(--color-accent)]">{prompt.model}</span>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-[var(--color-border)]">
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <span className="text-[20px] font-[Anton] text-[var(--color-text)]">{(prompt.view_count || 0).toLocaleString()}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide font-[Epilogue]">views</span>
            </div>
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
              <span className="text-[20px] font-[Anton] text-[var(--color-text)]">{(prompt.save_count || 0).toLocaleString()}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wide font-[Epilogue]">saves</span>
            </div>
          </div>

          {/* Create Me CTA */}
          <div className="flex flex-col gap-3 mb-8">
            <button 
              onClick={handleCreateClick}
              className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold text-[15px] shadow-[0_4px_24px_var(--color-primary-glow)] hover:shadow-[0_8px_32px_var(--color-primary-glow)] hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 cursor-pointer font-[Epilogue]"
            >
              <Flame className="w-5 h-5" />
              Create This Trend
            </button>
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] text-[13px] font-semibold transition-all cursor-pointer font-[Epilogue]"
              >
                {copied ? <Check className="w-4 h-4 text-[var(--color-success)]" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-full border text-[13px] font-semibold transition-all cursor-pointer font-[Epilogue] ${
                  isSaved 
                    ? 'bg-[var(--color-primary-surface)] border-[var(--color-primary)]/30 text-[var(--color-primary)]' 
                    : 'bg-[var(--color-bg-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center w-12 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Prompt Text */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-[Epilogue]">Prompt</h3>
              <button
                onClick={() => setIsPromptVisible(!isPromptVisible)}
                className="md:hidden flex items-center gap-1 text-[11px] text-[var(--color-accent)] font-semibold uppercase tracking-wide cursor-pointer bg-transparent border-0 font-[Epilogue]"
              >
                {isPromptVisible ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                {isPromptVisible ? 'Hide' : 'Show'}
              </button>
            </div>
            
            <div className={`md:block ${isPromptVisible ? 'block' : 'hidden'}`}>
              <div className="glass-card !rounded-xl p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-primary)]"></div>
                <p className="pl-3 text-[14px] text-[var(--color-text-secondary)] leading-relaxed font-[Epilogue]">
                  {prompt.prompt_text}
                </p>
              </div>
            </div>
          </div>

          {/* Launch Links */}
          <div className="glass-card !rounded-xl p-5 mb-6">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-[Epilogue] mb-3">Launch with</h3>
            <div className="flex flex-col gap-2">
              <a href={chatGptUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-bg-surface-hover)] hover:bg-white/[0.06] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all no-underline cursor-pointer group">
                <span className="text-[13px] font-semibold text-[var(--color-text)] font-[Epilogue]">ChatGPT</span>
                <ExternalLink className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
              </a>
              <a href={`/tools/prompt-enhancer?q=${encodeURIComponent(prompt.prompt_text)}`} className="flex items-center justify-between px-4 py-3 rounded-xl bg-[var(--color-bg-surface-hover)] hover:bg-white/[0.06] border border-[var(--color-border)] hover:border-[var(--color-border-hover)] transition-all no-underline cursor-pointer group">
                <span className="text-[13px] font-semibold text-[var(--color-text)] font-[Epilogue]">Enhance First</span>
                <Wand2 className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-[var(--color-accent)] transition-colors" />
              </a>
            </div>
          </div>

          {/* Creator */}
          <div className="flex items-center gap-3 pt-6 border-t border-[var(--color-border)]">
            <div className="w-10 h-10 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              {prompt.creator?.avatar ? (
                <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[var(--color-text-muted)] text-[14px] font-bold font-[Epilogue]">L4P</span>
              )}
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] font-[Epilogue]">Curated by</p>
              <p className="text-[13px] font-semibold text-[var(--color-text)] font-[Epilogue]">{prompt.creator?.name || 'Love4Prompts'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Redirection Countdown Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="glass-card !rounded-3xl p-8 max-w-md w-full text-center shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
            <div className="w-16 h-16 bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Flame className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h3 className="font-[Anton] text-[24px] uppercase text-[var(--color-text)] mb-3">
              Prepare Your Photo
            </h3>
            <p className="text-[var(--color-text-secondary)] text-[13px] font-[Epilogue] bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/30 py-3 px-4 rounded-xl mb-6">
              ⚠️ You'll need to add a photo of yours in ChatGPT!
            </p>
            <p className="text-[var(--color-text-muted)] text-[13px] font-semibold font-[Epilogue]">
              Redirecting in <span className="text-[var(--color-text)] font-[Anton] text-[20px]">{countdown}</span> seconds...
            </p>
            <div className="w-full bg-[var(--color-bg-surface)] h-2 rounded-full mt-4 overflow-hidden border border-[var(--color-border)]">
              <div 
                className="bg-[var(--color-primary)] h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${(3 - countdown) * 33.3}%` }}
              />
            </div>
            <p className="text-[var(--color-success)] text-[11px] font-semibold mt-4 font-[Epilogue]">
              📋 Prompt auto-copied! Just paste (Ctrl+V) in ChatGPT.
            </p>
            <div className="flex justify-between items-center mt-6">
              <button 
                onClick={() => setIsRedirecting(false)}
                className="text-[12px] text-[var(--color-destructive)] hover:text-[var(--color-destructive)]/80 font-semibold cursor-pointer bg-transparent border-0 font-[Epilogue]"
              >
                Cancel
              </button>
              <button 
                onClick={handleSkipCountdown}
                className="text-[12px] text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-semibold cursor-pointer bg-transparent border-0 font-[Epilogue]"
              >
                Launch Now →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
