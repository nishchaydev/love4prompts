import React, { useState } from 'react';
import { Copy, Check, Bookmark, BookmarkCheck, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
      alert('Please sign in to save prompts.');
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
      setIsSaved(!newSavedState); // revert
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(prompt.prompt_text);
      } else {
        // Fallback for non-HTTPS contexts
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

  const encodedPrompt = encodeURIComponent(prompt.prompt_text);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Col - Image */}
      <div className="w-full relative rounded-2xl overflow-hidden bg-[var(--color-background-card)] border border-[var(--color-border)]">
        {prompt.image_url ? (
          <img 
            src={getOptimizedImageUrlDetail(prompt.image_url)} 
            alt={prompt.title} 
            width={800}
            height={600}
            className="w-full h-auto object-cover"
            loading="eager"
            {...({ fetchPriority: "high" } as any)}
          />
        ) : (
          <div className="w-full aspect-square flex items-center justify-center">
            <span className="text-[var(--color-text-muted)]">No image available</span>
          </div>
        )}
      </div>

      {/* Right Col - Details */}
      <div className="flex flex-col">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{prompt.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {prompt.model && <Badge variant="secondary">{prompt.model}</Badge>}
          {prompt.style && <Badge variant="outline">{prompt.style}</Badge>}
          <span className="text-[var(--color-text-muted)] text-sm ml-auto">
            {prompt.view_count.toLocaleString()} views
          </span>
        </div>

        {/* Prompt Text Box */}
        <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6 mb-8 relative group">
          <p className="text-[var(--color-text-primary)] font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
            {prompt.prompt_text}
          </p>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="w-10 h-10 p-0 rounded-lg shadow-lg"
              onClick={handleCopy}
              aria-label="Copy prompt"
            >
              {copied ? <Check className="w-4 h-4 text-[var(--color-success-green)]" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Button 
            size="lg" 
            variant="primary" 
            className="w-full flex items-center justify-center gap-2"
            onClick={() => window.open(`https://www.bing.com/images/create?q=${encodedPrompt}`, '_blank', 'noopener,noreferrer')}
          >
            <ExternalLink className="w-5 h-5" />
            Generate in Bing
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            {isSaving ? 'Saving...' : isSaved ? 'Saved to Library' : 'Save Prompt'}
          </Button>
        </div>

        {/* Tags */}
        <div className="mt-auto pt-8 border-t border-[var(--color-border)]">
          <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {prompt.tags.map((tag) => (
              <a 
                key={tag} 
                href={`/?tag=${tag}`} 
                className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] bg-[var(--color-background-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] px-3 py-1.5 rounded-full transition-colors"
              >
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
