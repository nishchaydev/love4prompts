import React, { useState } from 'react';
import { Copy, Check, Bookmark, BookmarkCheck, ExternalLink, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import type { Prompt } from '../library/PromptCard';

const getOptimizedImageUrlDetail = (url: string | null): string => {
  if (!url) return '';
  if (url.includes('images.unsplash.com')) {
    let optimized = url;
    if (optimized.includes('w=')) {
      optimized = optimized.replace(/w=\d+/, 'w=800');
    } else {
      optimized += '&w=800';
    }
    if (optimized.includes('q=')) {
      optimized = optimized.replace(/q=\d+/, 'q=75');
    } else {
      optimized += '&q=75';
    }
    if (!optimized.includes('auto=')) {
      optimized += '&auto=format';
    }
    return optimized;
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

    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    try {
      const { supabase } = await import('../../lib/supabase');
      if (!newSavedState) {
        await supabase
          .from('saved_prompts')
          .delete()
          .eq('user_id', session.user.id)
          .eq('prompt_id', prompt.id);
          
        await supabase.rpc('decrement_save_count', { row_id: prompt.id });
      } else {
        await supabase
          .from('saved_prompts')
          .insert({ user_id: session.user.id, prompt_id: prompt.id });
          
        await supabase.rpc('increment_save_count', { row_id: prompt.id });
      }
    } catch (err) {
      console.error('Error saving prompt:', err);
      setIsSaved(!newSavedState); // revert
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
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
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{prompt.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-8">
          {prompt.model && <Badge variant="secondary">{prompt.model}</Badge>}
          {prompt.style && <Badge variant="outline">{prompt.style}</Badge>}
          <span className="text-[var(--color-text-muted)] text-sm ml-auto">
            {prompt.view_count.toLocaleString()} views
          </span>
        </div>

        {/* Prompt Text Box */}
        <div className="bg-[var(--color-background-elevated)] border border-[var(--color-border)] rounded-xl p-4 sm:p-6 mb-8 relative group">
          <p className="text-[var(--color-text-primary)] font-mono text-sm leading-relaxed whitespace-pre-wrap">
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
            onClick={() => window.open(`https://www.bing.com/images/create?q=${encodedPrompt}`, '_blank')}
          >
            <ExternalLink className="w-5 h-5" />
            Generate in Bing
          </Button>
          <Button 
            size="lg" 
            variant="secondary" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleSave}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
            {isSaved ? 'Saved to Library' : 'Save Prompt'}
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
