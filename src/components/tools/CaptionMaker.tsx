import React, { useState, useEffect } from 'react';
import { getBadgeColors } from '../../lib/ui-helpers';
import { 
  Heart, MessageCircle, Send, Bookmark, Loader2, Copy, Check, RotateCcw, Sparkles, Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { springs } from '../../lib/motion';
import { supabase } from '../../lib/supabase';
import { AuthModal } from '../auth/AuthModal';

export const CaptionMaker: React.FC = () => {
  const [description, setDescription] = useState('');
  const [niche, setNiche] = useState('');
  const [goal, setGoal] = useState('Get Saves');
  const [postType, setPostType] = useState('Static');
  const [tone, setTone] = useState('Storytelling');
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [includeEmojis, setIncludeEmojis] = useState(true);
  
  const [output, setOutput] = useState('');
  const [scoreData, setScoreData] = useState<{ score: number, topFix: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [session, setSession] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Generate post handler
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (description.trim().length < 5) {
      setError('Please describe your post in a bit more detail (minimum 5 characters).');
      return;
    }
    if (loading) return;

    setLoading(true);
    setError('');
    setOutput('');
    setScoreData(null);

    const styles = [];
    if (includeHashtags) styles.push('Include Hashtags');
    else styles.push('No Hashtags');
    
    if (includeEmojis) styles.push('Lots of Emojis');
    else styles.push('No Emojis');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const res = await fetch('/api/tools/instagram-caption', {
        method: 'POST',
        headers,
        body: JSON.stringify({ description, niche, goal, postType, tone, styles }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate Instagram caption.');
      }

      setOutput(data.caption || '');
      if (data.score !== undefined && data.score >= 0) {
        setScoreData({ score: data.score, topFix: data.topFix });
      }
      
      // Clarity Event Tracking
      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'instagram_caption_generated');
      }
    } catch (err: any) {
      console.error('Caption generator error:', err);
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
        (window as any).clarity('event', 'instagram_caption_copied');
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

  // Determine badge color for Neo-Brutalism theme


  return (
    <div className="relative w-full min-h-screen overflow-hidden font-['Inter'] pt-20">
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

      {/* Main Grid Layout */}
      <div className="relative z-10 container mx-auto max-w-[1200px] grid grid-cols-1 md:grid-cols-12 border-l border-[#cfc4c5] min-h-[calc(100vh-80px)]">

        {/* Row 1: Left Spacer | Header */}
        <div className="hidden md:block md:col-span-3 lg:col-span-2 border-r border-[#cfc4c5] relative overflow-visible bg-transparent">
          <div className="p-8 sticky top-24 h-full flex flex-col justify-between">
            <h1
              className="absolute top-[200px] left-[20px] xl:left-[50px] text-[180px] lg:text-[240px] leading-[0.75] font-black tracking-tighter text-black uppercase opacity-[0.07] hover:opacity-[0.15] transition-opacity m-0 pointer-events-none z-0"
              style={{ transformOrigin: 'top left', transform: 'rotate(-90deg) translate(-100%, 0)' }}
            >
              CAPTION
            </h1>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="md:col-span-9 lg:col-span-10 flex flex-col gap-10 p-6 lg:p-16 pb-32">

          {/* Header Title */}
          <div className="flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6D87] text-white rounded-full font-bold tracking-widest text-[12px] uppercase shadow-[4px_4px_0_#000] border-[2px] border-black">
              INSTA CAPTION GENERATOR
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-black uppercase" style={{ fontFamily: "'Inter', sans-serif", lineHeight: 1 }}>
              Write Viral Insta Captions
            </h1>
            <p className="text-base font-bold text-gray-700 max-w-2xl">
              Describe your photo, define your audience, and let AI craft the perfect caption tailored to the Instagram algorithm.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT COLUMN: INPUTS */}
            <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-3xl p-6 flex flex-col gap-6">
              <form onSubmit={handleGenerate} className="flex flex-col gap-6">
                
                {/* Topic text area */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="topic-input" className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    What is the post about?
                  </label>
                  <textarea
                    id="topic-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 500))}
                    rows={3}
                    maxLength={500}
                    placeholder="/// ENTER ANY ADDITIONAL CONTEXT..."
                    disabled={loading}
                    className="w-full bg-gray-50 border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 text-[13.5px] text-black focus:outline-none focus:shadow-[6px_6px_0_#FF6D87] focus:-translate-y-1 transition-all duration-300 placeholder:font-mono placeholder-black/30 resize-none font-medium leading-relaxed min-h-[100px]"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {error ? (
                      <span className="text-red-500 font-bold text-[10px] uppercase tracking-widest">{error}</span>
                    ) : (
                      <span />
                    )}
                    <span className="text-[10px] text-black/30 font-mono">
                      {description.length} / 500
                    </span>
                  </div>
                </div>

                {/* NEW: Niche / Audience */}
                <div className="flex flex-col gap-2.5">
                  <label htmlFor="niche-input" className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Your Niche / Audience
                  </label>
                  <input
                    id="niche-input"
                    type="text"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    placeholder="e.g. fitness coaches, startup founders, new moms"
                    disabled={loading}
                    className="w-full bg-gray-50 border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-3 text-[13.5px] text-black focus:outline-none focus:shadow-[6px_6px_0_#06D6A0] focus:-translate-y-1 transition-all duration-300 placeholder:font-mono placeholder-black/30 font-medium"
                  />
                </div>

                {/* NEW: Goal Dropdown */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Goal of this post
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {['Educate', 'Entertain', 'Sell', 'Get Saves', 'Build Community'].map((g) => {
                      const isActive = goal === g;
                      return (
                        <motion.button
                          key={g}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={springs.bouncy}
                          type="button"
                          onClick={() => setGoal(g)}
                          disabled={loading}
                          className={`py-2 px-2 text-center rounded-xl text-[11px] font-semibold tracking-tight cursor-pointer ${
                            isActive
                              ? 'bg-[#1482A3] text-white shadow-[0_0_15px_rgba(20,130,163,0.5)] border-[2px] border-black'
                              : 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-black/60 hover:text-black hover:border-black/20'
                          }`}
                        >
                          {g}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* NEW: Post Type Dropdown */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Post Type
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Reel', 'Static', 'Carousel'].map((pt) => {
                      const isActive = postType === pt;
                      return (
                        <motion.button
                          key={pt}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={springs.bouncy}
                          type="button"
                          onClick={() => setPostType(pt)}
                          disabled={loading}
                          className={`py-2 px-1 text-center rounded-xl text-[11px] font-semibold tracking-tight cursor-pointer ${
                            isActive
                              ? 'bg-[#FFD166] text-black shadow-[0_0_15px_rgba(255,209,102,0.5)] border-[2px] border-black'
                              : 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-black/60 hover:text-black hover:border-black/20'
                          }`}
                        >
                          {pt}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Tone selector */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xs font-mono font-bold text-[var(--color-primary)] uppercase tracking-wider">
                    Tone of voice
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Funny', 'Professional', 'Inspirational', 'Edgy', 'Storytelling', 'Short'].map((t) => {
                      const isActive = tone === t;
                      return (
                        <motion.button
                          key={t}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={springs.bouncy}
                          type="button"
                          onClick={() => setTone(t)}
                          disabled={loading}
                          className={`py-2 px-2 text-center rounded-xl text-[11px] font-semibold tracking-tight cursor-pointer ${
                            isActive
                              ? 'bg-[var(--color-primary)] text-black shadow-[0_0_15px_var(--color-primary-glow)] border-[2px] border-black'
                              : 'bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-black/60 hover:text-black hover:border-black/20'
                          }`}
                        >
                          {t}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Generate button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.bouncy}
                  type="submit"
                  disabled={loading || !description.trim()}
                  className="w-full h-12 rounded-2xl bg-[var(--color-primary)] hover:bg-[#ff5270] disabled:bg-black/5 disabled:text-black/20 text-white font-bold text-sm tracking-wide shadow-[4px_4px_0_#000] border-[2px] border-black flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-black" />
                      <span className="text-black">Generating & Scoring...</span>
                    </>
                  ) : (
                    <span className="text-black">Generate Caption</span>
                  )}
                </motion.button>

              </form>
            </div>

            {/* RIGHT COLUMN: OUTPUT PREVIEW */}
            <div className="flex flex-col gap-5">
              
              {/* Instagram Mockup Card */}
              <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden">
                
                {/* Header row */}
                <div className="flex items-center gap-3 border-b border-black/5 pb-3.5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-pink-500 p-[2px]">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[10px] font-bold text-black border border-white">
                      IG
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-bold text-black leading-tight">your_handle</span>
                    <span className="text-[11px] text-black/40 leading-tight">Original Audio</span>
                  </div>
                </div>

                {/* Post body */}
                <div className="min-h-[200px] text-sm text-black font-medium leading-relaxed whitespace-pre-wrap select-text py-1">
                  {loading ? (
                    // Shimmer state
                    <div className="flex flex-col gap-3.5 py-2">
                      <div className="h-4 w-11/12 bg-black/5 rounded skeleton-shimmer-line" />
                      <div className="h-4 w-full bg-black/5 rounded skeleton-shimmer-line" />
                      <div className="h-4 w-5/6 bg-black/5 rounded skeleton-shimmer-line" />
                      <div className="h-4 w-2/3 bg-black/5 rounded skeleton-shimmer-line" />
                    </div>
                  ) : output ? (
                    // Output content
                    output
                  ) : (
                    // Empty state placeholders
                    <div className="flex flex-col gap-5 py-4">
                      <div className="flex flex-col gap-3">
                        <div className="h-3 w-5/6 bg-black/5 rounded skeleton-shimmer-line" />
                        <div className="h-3 w-11/12 bg-black/5 rounded skeleton-shimmer-line" />
                        <div className="h-3 w-3/4 bg-black/5 rounded skeleton-shimmer-line" />
                        <div className="h-3 w-1/2 bg-black/5 rounded skeleton-shimmer-line" />
                      </div>
                      <p className="text-xs text-black/30 italic text-center mt-3">
                        Your caption will appear here
                      </p>
                    </div>
                  )}
                </div>

                {/* Divider line */}
                <div className="h-px bg-black border border-black/10" />

                {/* Fake actions row */}
                <div className="flex items-center justify-between px-1 text-black/80">
                  <div className="flex gap-4">
                    <Heart className="w-5 h-5 cursor-pointer hover:text-red-500 transition-colors" />
                    <MessageCircle className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" />
                    <Send className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" />
                  </div>
                  <Bookmark className="w-5 h-5 cursor-pointer hover:text-gray-500 transition-colors" />
                </div>
              </div>

              {/* Share Score Badge */}
              {scoreData && !loading && (
                <div className="relative group mt-4">
                  <div className={`p-4 border-[3px] rounded-xl flex items-start gap-4 ${getBadgeColors(scoreData.score)} ${!session ? 'blur-[4px] select-none opacity-60' : ''} transition-all duration-300`}>
                    <div className="flex flex-col items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0_#000] rounded-lg p-2 min-w-[70px]">
                      <span className="text-[10px] uppercase font-black tracking-wider text-black">Score</span>
                      <span className="text-2xl font-black text-black leading-none mt-1">{scoreData.score}</span>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-black text-sm uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Sparkles className="w-4 h-4" /> Share Score Feedback
                      </h4>
                      <p className="text-xs font-bold font-mono opacity-90">{scoreData.topFix}</p>
                    </div>
                  </div>
                  
                  {!session && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white/10 rounded-xl border-[3px] border-transparent">
                      <button 
                        type="button"
                        onClick={() => setIsAuthModalOpen(true)}
                        className="bg-[var(--color-primary)] text-black px-5 py-2.5 rounded-xl font-bold text-sm border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 cursor-pointer"
                      >
                        <Lock className="w-4 h-4" />
                        Sign in to view Score
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Under preview controls */}
              {output && !loading && (
                <div className="flex flex-col gap-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-black/60">
                      {output.length} characters
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Copy Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springs.bouncy}
                      type="button"
                      onClick={handleCopy}
                      className="h-11 rounded-xl border-[2px] border-black bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] text-black font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-shadow"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-green-600" />
                          Copied ✓
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Caption
                        </>
                      )}
                    </motion.button>

                    {/* Regenerate Button */}
                    <motion.button
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springs.bouncy}
                      type="button"
                      onClick={() => handleGenerate()}
                      className="h-11 rounded-xl border-[2px] border-black bg-gray-100 shadow-[4px_4px_0_rgba(0,0,0,1)] hover:shadow-[6px_6px_0_rgba(0,0,0,1)] text-black font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer transition-shadow"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Regenerate
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
};
