import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Loader2, Copy, Check, ExternalLink, ImagePlus } from 'lucide-react';
import { getRemainingUses, recordUse, hasReachedLimit } from '../../lib/rate-limit';
import { AI_MODELS } from '../hero/logos';
import { springs } from '../../lib/motion';

const TOOL_SLUG = 'image-to-prompt';
const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const MAX_DIMENSION = 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function resizeImage(file: File): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const ratio = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        const dataUrl = canvas.toDataURL(mimeType, 0.85);
        const base64 = dataUrl.split(',')[1];
        resolve({ base64, mimeType });
      };
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

export const ImageToPrompt: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [targetModel, setTargetModel] = useState('Midjourney');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [remainingUses, setRemainingUses] = useState(() => getRemainingUses(TOOL_SLUG));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Upload JPG, PNG, or WebP.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File too large. Maximum 4MB.');
      return;
    }
    setError('');
    setResult('');
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + ' MB');
    try {
      const data = await resizeImage(file);
      setImageData(data);
      setPreview(URL.createObjectURL(file));
    } catch (err: any) {
      setError(err.message || 'Failed to process image.');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleClear = () => {
    setPreview(null);
    setImageData(null);
    setResult('');
    setError('');
    setFileName('');
    setFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!imageData) {
      setError('Upload an image first.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError("You've reached your daily limit of 5 free analyses.");
      return;
    }
    setError('');
    setResult('');
    setLoading(true);

    try {
      const response = await fetch('/api/tools/image-to-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: imageData.base64,
          mimeType: imageData.mimeType,
          targetModel,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Analysis failed.');
      setResult(data.prompt || '');
      recordUse(TOOL_SLUG);
      setRemainingUses(getRemainingUses(TOOL_SLUG));

      if (typeof window !== 'undefined' && (window as any).clarity) {
        (window as any).clarity('event', 'image_analyzed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement('textarea');
      el.value = result;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const usedUses = 5 - remainingUses;

  // Phase 1: Upload zone (no image yet)
  // Phase 2: Split view (image + output)
  const hasImage = !!preview;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8 relative z-10">
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <AnimatePresence mode="wait">
        {!hasImage ? (
          /* ── PHASE 1: UPLOAD ZONE ── */
          <motion.div
            key="upload-phase"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } }}
            transition={springs.gentle}
            className="max-w-xl mx-auto"
          >
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-5 py-20 px-8 rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
                dragOver
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] scale-[1.01]'
                  : 'border-white/[0.08] bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] hover:border-black hover:bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)]'
              }`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                dragOver
                  ? 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]'
                  : 'bg-white/[0.03] border border-white/[0.04] text-[var(--color-text-muted)]'
              }`}>
                <Upload className="w-7 h-7" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-black mb-1.5">
                  {dragOver ? 'Drop to analyze' : 'Drop an image or click to upload'}
                </p>
                <p className="text-[12px] text-[var(--color-text-muted)] font-medium">
                  JPG, PNG, or WebP · Max 4MB
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload-input"
              />
            </div>

            {error && (
              <div className="mt-4 text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs text-center">
                {error}
              </div>
            )}
          </motion.div>
        ) : (
          /* ── PHASE 2: SPLIT VIEW ── */
          <motion.div
            key="split-phase"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={springs.gentle}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
          >
            {/* LEFT: Image Preview */}
            <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-surface)] border border-[var(--color-border-warm)] flex items-center justify-center text-[var(--color-primary)]">
                    <ImagePlus className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-black truncate max-w-[200px]">{fileName}</p>
                    <p className="text-[10px] text-[var(--color-text-muted)] font-mono">{fileSize}</p>
                  </div>
                </div>
                <button
                  onClick={handleClear}
                  className="w-7 h-7 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-[var(--color-text-muted)] hover:text-red-400 transition-all cursor-pointer"
                  aria-label="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-black/20 border-[3px] border-black flex-1 flex items-center justify-center">
                <img
                  src={preview}
                  alt="Uploaded preview"
                  className="max-w-full max-h-[400px] object-contain"
                />
              </div>
            </div>

            {/* RIGHT: Controls + Output */}
            <div className="bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] border-[3px] border-black rounded-2xl p-6 flex flex-col gap-5">
              {/* Target model pills */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-text-muted)] uppercase">
                  Extract prompt for
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {AI_MODELS.map((model) => {
                    const isActive = targetModel === model.id;
                    const Icon = model.icon;
                    return (
                      <button
                        key={model.id}
                        type="button"
                        onClick={() => setTargetModel(model.id)}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-primary-surface)] text-[var(--color-primary)]'
                            : 'border-black border-[2px] bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black hover:border-black'
                        }`}
                      >
                        <Icon className="w-3 h-3" />
                        {model.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Output area */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-mono font-bold tracking-widest text-[var(--color-primary)] uppercase">
                    Extracted Prompt
                  </label>
                  {result && !loading && (
                    <button
                      onClick={handleCopy}
                      className="w-7 h-7 rounded-lg bg-black/40 hover:bg-black/70 flex items-center justify-center text-black border border-black/20 border-[2px] transition-all cursor-pointer active:scale-90"
                      title="Copy"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-[var(--color-success-green)]" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>

                <div tabIndex={0} className="w-full bg-gray-50 border-[3px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] rounded-xl p-4 text-[13.5px] text-black focus:outline-none focus:shadow-[6px_6px_0_#FF6D87] focus:-translate-y-1 transition-all duration-300 placeholder:font-mono placeholder-black/30 resize-none font-medium leading-relaxed min-h-[140px] overflow-y-auto max-h-[360px] select-text">
                  {loading ? (
                    <div className="flex flex-col gap-3 py-1">
                      <div className="h-3.5 w-full bg-white/[0.03] rounded animate-pulse" />
                      <div className="h-3.5 w-5/6 bg-white/[0.03] rounded animate-pulse" />
                      <div className="h-3.5 w-11/12 bg-white/[0.03] rounded animate-pulse" />
                      <div className="h-3.5 w-3/4 bg-white/[0.03] rounded animate-pulse" />
                    </div>
                  ) : result ? (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                      {result}
                    </motion.span>
                  ) : (
                    <span className="text-black/15 italic text-[12px]">
                      /// Extracted prompt will appear here...
                    </span>
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl text-xs">
                  {error}
                </div>
              )}

              {/* Rate limit + Analyze button */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          i < usedUses
                            ? 'bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)]'
                            : 'bg-white/10 border border-black/30 border-[2px]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-[var(--color-text-muted)] font-mono">
                    {remainingUses} of 5 free today
                  </span>
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={loading || !imageData || remainingUses === 0}
                  className="w-full h-11 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:bg-white/5 disabled:text-black/20 text-black font-bold text-xs tracking-wider uppercase transition-all shadow-[0_4px_25px_var(--color-primary-glow)] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing Image...
                    </>
                  ) : (
                    'Analyze Image →'
                  )}
                </button>
              </div>

              {/* Open in bar link */}
              {result && !loading && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/?q=${encodeURIComponent(result)}`;
                  }}
                  className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline flex items-center gap-1 font-semibold self-start"
                >
                  <span>Open in Bar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
