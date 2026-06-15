import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { PromptCard, type Prompt } from './PromptCard';
import { supabase } from '../../lib/supabase';

interface MasonryGridProps {
  prompts: Prompt[];
  savedPromptIds?: Set<string>;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ prompts, savedPromptIds: initialSavedIds = new Set() }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(initialSavedIds);
  const [session, setSession] = useState<any>(null);
  const [visibleCount, setVisibleCount] = useState(16);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // ── Expand prompts into a longer list so we can simulate infinite scroll ──
  const infinitePrompts = useMemo(() => {
    if (prompts.length === 0) return [];
    const repeated: Prompt[] = [];
    let cycleCount = 0;
    while (repeated.length < 2000) {
      // Shift the prompts list on each cycle to mix the repeating pattern
      const shiftedPrompts = [...prompts];
      const shiftAmount = cycleCount % prompts.length;
      if (shiftAmount > 0) {
        const chunk = shiftedPrompts.splice(0, shiftAmount);
        shiftedPrompts.push(...chunk);
      }

      repeated.push(
        ...shiftedPrompts.map((p, i) => ({
          ...p,
          realId: p.id,
          id: `${p.id}__dup${repeated.length + i}`,
        })),
      );
      cycleCount++;
    }
    return repeated;
  }, [prompts]);

  // ── IntersectionObserver for infinite scroll ──────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + 12);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  // ── Auth & saved prompts ──────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && initialSavedIds.size === 0) {
        supabase
          .from('saved_prompts')
          .select('prompt_id')
          .eq('user_id', session.user.id)
          .then(({ data }) => {
            if (data) {
              setSavedIds(new Set(data.map(d => d.prompt_id)));
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) setSavedIds(new Set());
    });

    return () => subscription.unsubscribe();
  }, [initialSavedIds]);

  // ── Save / unsave handler ─────────────────────────────────────────
  const handleSave = useCallback(async (promptId: string) => {
    if (!session) {
      alert('Please sign in to save prompts.');
      return;
    }

    // Look up the original ID from the duplicated prompt
    const prompt = infinitePrompts.find(p => p.id === promptId);
    const realId = prompt?.realId ?? promptId;
    const isSaved = savedIds.has(promptId);

    // Capture pre-operation state for rollback
    const prevSaved = new Set(savedIds);

    const newSavedIds = new Set(savedIds);
    if (isSaved) {
      newSavedIds.delete(promptId);
    } else {
      newSavedIds.add(promptId);
    }
    setSavedIds(newSavedIds);

    try {
      if (isSaved) {
        await supabase
          .from('saved_prompts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('prompt_id', realId);
        const { error } = await supabase.rpc('decrement_save_count', { row_id: realId });
        if (error) throw error;
      } else {
        await supabase
          .from('saved_prompts')
          .insert({ user_id: session.user.id, prompt_id: realId });
        const { error } = await supabase.rpc('increment_save_count', { row_id: realId });
        if (error) throw error;
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      setSavedIds(prevSaved);
    }
  }, [session, savedIds, infinitePrompts]);

  const displayedPrompts = infinitePrompts.slice(0, visibleCount);
  const hasMore = visibleCount < infinitePrompts.length;

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-2">
        {displayedPrompts.map((prompt, idx) => (
          <div key={prompt.id} className="break-inside-avoid">
            <PromptCard
              prompt={prompt}
              isSaved={savedIds.has(prompt.id)}
              onSave={handleSave}
              index={idx}
            />
          </div>
        ))}
      </div>

      {/* Skeleton loading cards */}
      {hasMore && (
        <div className="columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-2 mt-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="break-inside-avoid rounded-2xl border border-white/[0.06] overflow-hidden"
              style={{
                height: `${220 + (i % 3) * 60}px`,
                background:
                  'linear-gradient(90deg, #120A24 25%, #1d1238 50%, #120A24 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
              }}
            />
          ))}
        </div>
      )}

      {/* Sentinel for intersection observer */}
      <div ref={sentinelRef} className="h-4 w-full" aria-hidden="true" />

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
};
