import React, { useState, useEffect } from 'react';
import { PromptCard, type Prompt } from './PromptCard';
import { supabase } from '../../lib/supabase';

interface MasonryGridProps {
  prompts: Prompt[];
  savedPromptIds?: Set<string>;
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({ prompts, savedPromptIds: initialSavedIds = new Set() }) => {
  const [savedIds, setSavedIds] = useState<Set<string>>(initialSavedIds);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session && initialSavedIds.size === 0) {
        // Fetch user's saved prompts
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

  const handleSave = async (promptId: string) => {
    if (!session) {
      alert('Please sign in to save prompts.');
      return;
    }

    const isSaved = savedIds.has(promptId);
    
    // Optimistic UI update
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
          .eq('prompt_id', promptId);
          
        await supabase.rpc('decrement_save_count', { row_id: promptId }).then();
      } else {
        await supabase
          .from('saved_prompts')
          .insert({ user_id: session.user.id, prompt_id: promptId });
          
        await supabase.rpc('increment_save_count', { row_id: promptId }).then();
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      // Revert optimistic update on error
      setSavedIds(savedIds);
    }
  };

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 space-y-2">
      {prompts.map((prompt) => (
        <div key={prompt.id} className="break-inside-avoid">
          <PromptCard 
            prompt={prompt} 
            isSaved={savedIds.has(prompt.id)}
            onSave={handleSave}
          />
        </div>
      ))}
    </div>
  );
};
