import React, { useState } from 'react';
import type { Prompt } from '../library/PromptCard';
import { mockPrompts } from '../../lib/mock-data';

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

  const titleWords = prompt.title.toUpperCase().split(' ');
  const titleLine1 = titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' ');
  const titleLine2 = titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ');

  // Group related images by prompt text
  const relatedImages = mockPrompts
    .filter(p => p.prompt_text === prompt.prompt_text && p.image_url)
    .map(p => p.image_url as string);
    
  if (relatedImages.length === 0 && prompt.image_url) {
    relatedImages.push(prompt.image_url);
  }

  /* Launch URLs */
  const promptPrefix = "Generate an image using this prompt: ";
  const chatGptUrl = `https://chatgpt.com/?q=${encodeURIComponent(promptPrefix + prompt.prompt_text)}`;

  return (
    <>
      <main className="flex-grow flex flex-col md:flex-row relative overflow-hidden max-w-7xl mx-auto w-full border-x border-black">
      {/* Massive Background Wordmark */}
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center opacity-[0.05] overflow-hidden">
        <h1
          className="text-black whitespace-nowrap select-none"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '320px', lineHeight: '280px', letterSpacing: '-0.05em', fontWeight: 700 }}
        >
          TREND
        </h1>
      </div>

      {/* Mobile-only Header */}
      <div className="block md:hidden w-full p-6 border-b border-black">
        <h2
          className="text-black uppercase mb-4 leading-none"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 'clamp(32px, 8vw, 56px)', lineHeight: '1', letterSpacing: '-0.04em' }}
        >
          {titleLine1}<br />{titleLine2}
        </h2>
        <div className="flex flex-wrap gap-2">
          {prompt.category && (
            <span className="px-3 py-1 border-2 border-[#FF6D87] text-[#FF6D87] ed-label-caps bg-[#f9f9f9] rounded-full font-bold">{prompt.category.toUpperCase()}</span>
          )}
          {prompt.subcategory && (
            <span className="px-3 py-1 border border-black ed-label-caps bg-[#f9f9f9] rounded-full">{prompt.subcategory.toUpperCase()}</span>
          )}
          {prompt.model && (
            <span className="px-2 py-1 border border-[#0047BB] text-[#0047BB] ed-label-caps bg-[#f9f9f9]">{prompt.model.toUpperCase()}</span>
          )}
        </div>
      </div>

      {/* Left: Hero Image(s) */}
      <div className="w-full md:w-1/2 p-6 md:p-[40px] relative z-10 border-b md:border-b-0 md:border-r border-black bg-[#fafafa]">
        <div className={`w-full ${relatedImages.length > 1 ? 'columns-2 gap-4' : 'flex justify-center'}`}>
          {relatedImages.length > 0 ? (
            relatedImages.map((img, i) => (
              <div key={i} className={`relative w-full border-4 border-black rounded-[24px] overflow-hidden group bg-[#111] mb-4 break-inside-avoid shadow-[8px_8px_0_#FF6D87]`}>
                <img
                  alt={`${prompt.title} - Image ${i + 1}`}
                  className="w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
                  style={{ filter: 'contrast(1.15) saturate(1.25)' }}
                  src={getOptimizedImageUrlDetail(img)}
                  loading={i === 0 ? "eager" : "lazy"}
                />
                {/* Image Overlay Metadata */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent text-white flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div>
                    <p className="ed-label-caps text-[#cfc4c5] mb-1">REFERENCE</p>
                    <p className="ed-label-ui text-white">IMG_{i + 1}</p>
                  </div>
                  <span className="material-symbols-outlined text-[#FF3B30]">aspect_ratio</span>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full aspect-square flex items-center justify-center border-4 border-black border-dashed rounded-[24px]">
              <span className="ed-label-caps text-[#4c4546]">No image available</span>
            </div>
          )}
        </div>

        {/* Mobile-only Launch Buttons */}
        <div className="block md:hidden w-full mt-6">
          <button 
            onClick={handleCreateClick}
            className="w-full justify-center px-6 py-4 bg-[#FF6D87] border-4 border-black rounded-full font-black uppercase tracking-widest text-white text-[14px] active:bg-black transition-all shadow-[6px_6px_0_#000] active:shadow-[2px_2px_0_#000] active:translate-y-1 flex items-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>image</span>
            Create Image
          </button>
        </div>
      </div>

      {/* Right: Trend Data + Launch */}
      <div className="w-full md:w-1/2 flex flex-col relative z-10">
        {/* Desktop-only Header Section */}
        <div className="hidden md:block p-[40px] border-b border-black">
          <h2
            className="text-black uppercase mb-[24px] leading-none"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: '1', letterSpacing: '-0.04em' }}
          >
            {titleLine1}<br />{titleLine2}
          </h2>
          <div className="flex flex-wrap gap-2 mb-[24px]">
            {prompt.category && (
              <span className="px-3 py-1 border-2 border-[#FF6D87] text-[#FF6D87] ed-label-caps bg-[#f9f9f9] rounded-full font-bold">{prompt.category.toUpperCase()}</span>
            )}
            {prompt.subcategory && (
              <span className="px-3 py-1 border border-black ed-label-caps bg-[#f9f9f9] rounded-full">{prompt.subcategory.toUpperCase()}</span>
            )}
            {prompt.model && (
              <span className="px-2 py-1 border border-[#0047BB] text-[#0047BB] ed-label-caps bg-[#f9f9f9]">{prompt.model.toUpperCase()}</span>
            )}
          </div>
        </div>

        {/* ═══ LAUNCH BUTTONS (Desktop) — ABOVE prompt ═══ */}
        <div className="hidden md:flex p-[40px] border-b border-black flex-col gap-3">
          <h3 className="ed-label-caps text-[#4c4546] mb-2">RECREATE THIS TREND</h3>
          <button 
            onClick={handleCreateClick}
            className="w-full justify-center px-6 py-4 bg-[#FF6D87] border-4 border-black rounded-full font-black uppercase tracking-widest text-white text-[16px] hover:bg-black transition-all hover:-translate-y-1 shadow-[6px_6px_0_#000] hover:shadow-[8px_8px_0_#000] flex items-center gap-3 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>image</span>
            Create Image
          </button>
        </div>

        {/* Prompt Section — Below launch buttons */}
        <div className="p-6 md:p-[40px] border-b border-black flex-grow">
          <div className="flex justify-between items-center mb-[24px] border-b border-[#7e7576] pb-2">
            <h3 className="ed-label-caps text-[#4c4546]">PROMPT</h3>
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
          
          {/* Mobile hidden prompt toggle */}
          <div className={`block md:hidden mb-4 ${isPromptVisible ? 'hidden' : ''}`}>
            <button 
              onClick={() => setIsPromptVisible(true)} 
              className="w-full py-4 border-4 border-black border-dashed rounded-[16px] font-black uppercase text-black hover:bg-[#eee] transition-colors"
            >
              Click to Reveal Prompt
            </button>
          </div>

          <div className={`md:block ${isPromptVisible ? 'block' : 'hidden'}`}>
            <div className="bg-[#eeeeee] border border-black p-6 ed-body-main leading-relaxed relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#FF3B30]"></div>
              <p className="pl-4">
                {prompt.prompt_text}
              </p>
            </div>
          </div>
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

    {/* Redirection Countdown Overlay */}
    {isRedirecting && (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
        <div className="bg-white border-4 border-black p-8 rounded-[24px] max-w-md w-full shadow-[8px_8px_0_#000] text-center">
          <div className="w-16 h-16 bg-[#FFD166] border-4 border-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#000]">
            <span className="material-symbols-outlined text-2xl font-black text-black">photo_camera</span>
          </div>
          <h3 className="font-black text-2xl uppercase tracking-tight text-black mb-3">
            Prepare Your Photo
          </h3>
          <p className="text-black font-black uppercase text-sm tracking-wide bg-[#FF6D87]/20 border-2 border-[#FF6D87] py-3 px-4 rounded-xl mb-6">
            ⚠️ You will have to add a photo of yours!
          </p>
          <p className="text-gray-600 text-sm font-bold uppercase tracking-wider">
            Redirecting to ChatGPT in <span className="text-black font-black text-lg">{countdown}</span> seconds...
          </p>
          <div className="w-full bg-gray-200 h-3 border-2 border-black rounded-full mt-4 overflow-hidden">
            <div 
              className="bg-[#1482A3] h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(3 - countdown) * 33.3}%` }}
            />
          </div>
          <p className="text-[#1482A3] text-[10px] font-black uppercase tracking-wider mt-4">
            📋 Prompt auto-copied to clipboard! Just paste (Ctrl+V) in ChatGPT.
          </p>
          <div className="flex justify-between items-center mt-6">
            <button 
              onClick={() => setIsRedirecting(false)}
              className="text-xs text-red-500 hover:text-red-700 font-black uppercase tracking-widest underline bg-transparent border-0 cursor-pointer"
            >
              Cancel
            </button>
            <button 
              onClick={handleSkipCountdown}
              className="text-xs text-[#1482A3] hover:text-black font-black uppercase tracking-widest underline bg-transparent border-0 cursor-pointer"
            >
              Launch Immediately
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};
