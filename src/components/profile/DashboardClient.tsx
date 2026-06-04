import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { ReelSubmitForm } from './ReelSubmitForm';
import { MasonryGrid } from '../library/MasonryGrid';
import type { Prompt } from '../library/PromptCard';
import { Loader2 } from 'lucide-react';

export const DashboardClient: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchSavedPrompts(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchSavedPrompts(session.user.id);
      } else {
        setSavedPrompts([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchSavedPrompts = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('saved_prompts')
        .select(`
          prompt_id,
          prompts (*)
        `)
        .eq('user_id', userId)
        .order('saved_at', { ascending: false });

      if (error) throw error;
      
      const prompts = data.map((item: any) => item.prompts).filter(Boolean);
      setSavedPrompts(prompts);
    } catch (err) {
      console.error("Error fetching saved prompts:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-accent-purple)]" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-20 bg-[var(--color-background-card)] rounded-2xl border border-[var(--color-border)]">
        <h2 className="text-2xl font-bold mb-4">You need to sign in</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">Create an account to save prompts and extract them from Instagram.</p>
        {/* Would ideally trigger AuthModal here, but for now just tell them to use the header button */}
        <p className="text-[var(--color-accent-purple)] font-medium">Use the Sign In button in the header.</p>
      </div>
    );
  }

  const savedIds = new Set(savedPrompts.map(p => p.id));

  return (
    <div className="space-y-12">
      <section>
        <ReelSubmitForm />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Your Library</h2>
        {savedPrompts.length > 0 ? (
          <MasonryGrid prompts={savedPrompts} savedPromptIds={savedIds} />
        ) : (
          <div className="text-center py-16 bg-[var(--color-background-elevated)] rounded-2xl border border-[var(--color-border)] border-dashed">
            <p className="text-[var(--color-text-muted)]">You haven't saved any prompts yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
