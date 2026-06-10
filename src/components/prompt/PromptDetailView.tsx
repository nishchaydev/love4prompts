import React, { useState } from 'react';
import type { Prompt } from '../library/PromptCard';

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

  /* Extract model parameters from prompt text */
  const extractParams = (text: string) => {
    const params: Record<string, string> = {};
    const arMatch = text.match(/--ar\s+(\S+)/i);
    if (arMatch) params['ASPECT RATIO'] = arMatch[1];
    const vMatch = text.match(/--v\s+(\S+)/i);
    if (vMatch) params['ENGINE'] = `V ${vMatch[1]}`;
    const styleMatch = text.match(/--style\s+(\S+)/i);
    if (styleMatch) params['STYLE'] = styleMatch[1].toUpperCase();
    const cMatch = text.match(/--c\s+(\S+)/i);
    if (cMatch) params['CHAOS'] = cMatch[1];
    /* Fallback defaults */
    if (Object.keys(params).length === 0) {
      params['MODEL'] = prompt.model || 'AI';
      params['STYLE'] = prompt.style || 'General';
      params['VIEWS'] = prompt.view_count?.toLocaleString() || '—';
      params['SAVES'] = prompt.save_count?.toLocaleString() || '—';
    }
    return params;
  };

  const params = extractParams(prompt.prompt_text);
  const titleWords = prompt.title.toUpperCase().split(' ');
  const titleLine1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const titleLine2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  return (
    <main className="flex-grow flex flex-col md:flex-row relative overflow-hidden max-w-7xl mx-auto w-full border-x border-black">
      {/* Massive Background Wordmark */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.05] overflow-hidden">
        <h1
          className="text-black whitespace-nowrap select-none"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '320px', lineHeight: '280px', letterSpacing: '-0.05em', fontWeight: 700 }}
        >
          DETAIL
        </h1>
      </div>

      {/* Left: Hero Image */}
      <div className="w-full md:w-1/2 p-6 md:p-[40px] relative z-10 flex flex-col justify-center border-b md:border-b-0 md:border-r border-black bg-[#fafafa]">
        <div className="relative w-full h-[50vh] md:h-[70vh] chromatic-border overflow-hidden group bg-[#111]">
          {prompt.image_url ? (
            <img
              alt={prompt.title}
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
              style={{ filter: 'contrast(1.25) saturate(1.5)' }}
              src={getOptimizedImageUrlDetail(prompt.image_url)}
              loading="eager"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="ed-label-caps text-[#4c4546]">No image available</span>
            </div>
          )}
          {/* Image Overlay Metadata */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 text-white border-t border-[#FF3B30] flex justify-between items-end backdrop-blur-sm">
            <div>
              <p className="ed-label-caps text-[#cfc4c5] mb-1">REFERENCE</p>
              <p className="ed-label-ui text-white">IMG_{prompt.id.toString().padStart(3, '0')}_{(prompt.style || 'GEN').substring(0, 4).toUpperCase()}</p>
            </div>
            <span className="material-symbols-outlined text-[#FF3B30]">aspect_ratio</span>
          </div>
        </div>
      </div>

      {/* Right: Structural Prompt Data */}
      <div className="w-full md:w-1/2 flex flex-col relative z-10">
        {/* Header Section */}
        <div className="p-6 md:p-[40px] border-b border-black">
          <h2
            className="text-black uppercase mb-[24px] leading-none"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: '1', letterSpacing: '-0.04em' }}
          >
            {titleLine1}<br />{titleLine2}
          </h2>
          <div className="flex flex-wrap gap-2 mb-[24px]">
            {prompt.style && (
              <span className="px-2 py-1 border border-black ed-label-caps bg-[#f9f9f9]">{prompt.style.toUpperCase()}</span>
            )}
            {prompt.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 border border-black ed-label-caps bg-[#f9f9f9]">{tag.toUpperCase()}</span>
            ))}
            {prompt.model && (
              <span className="px-2 py-1 border border-[#0047BB] text-[#0047BB] ed-label-caps bg-[#f9f9f9]">{prompt.model.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* Prompt Formula Section */}
        <div className="p-6 md:p-[40px] border-b border-black flex-grow">
          <div className="flex justify-between items-center mb-[24px] border-b border-[#7e7576] pb-2">
            <h3 className="ed-label-caps text-[#4c4546]">BASE FORMULA</h3>
            <button
              onClick={handleCopy}
              className="ed-label-ui uppercase chromatic-underline inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 px-0"
              style={{ borderBottom: '2px solid #0047BB', fontSize: '12px' }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                {copied ? 'check' : 'content_copy'}
              </span>
              {copied ? 'COPIED' : 'COPY PROMPT'}
            </button>
          </div>
          <div className="bg-[#eeeeee] border border-black p-6 ed-body-main leading-relaxed relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-[#FF3B30]"></div>
            <p className="pl-4">
              {prompt.prompt_text}
            </p>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="px-6 md:px-[40px] grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-black border-b border-black">
          {Object.entries(params).map(([key, value]) => (
            <div key={key} className="bg-[#f9f9f9] p-4 flex flex-col gap-2">
              <span className="ed-label-caps text-[#4c4546]">{key}</span>
              <span className="ed-label-ui">{value}</span>
            </div>
          ))}
        </div>

        {/* Author & Actions */}
        <div className="p-6 md:p-[40px] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 sm:gap-0 bg-[#eeeeee]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-black bg-[#f9f9f9] flex items-center justify-center">
              {prompt.creator?.avatar ? (
                <img src={prompt.creator.avatar} alt={prompt.creator.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined">person</span>
              )}
            </div>
            <div>
              <p className="ed-label-caps text-[#4c4546] mb-1">CURATED BY</p>
              <p className="ed-label-ui uppercase">{prompt.creator?.name || 'SYSTEM ADMIN'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-12 h-12 border border-black bg-[#f9f9f9] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <span className={`material-symbols-outlined ${isSaved ? 'fill-icon' : ''}`}>bookmark</span>
            </button>
            <button
              onClick={handleShare}
              className="w-12 h-12 border border-black bg-[#f9f9f9] flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">share</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};
