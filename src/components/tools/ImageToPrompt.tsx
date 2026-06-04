import React, { useState, useRef, useCallback } from 'react';
import { Loader2, Upload, X, ImagePlus } from 'lucide-react';
import { ToolPageLayout } from './ToolPageLayout';
import { CopyableOutput } from './CopyableOutput';
import { recordUse, hasReachedLimit } from '../../lib/rate-limit';

const TOOL_SLUG = 'image-to-prompt';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [, forceUpdate] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('Invalid file type. Please upload a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large. Maximum size is 5MB.');
      return;
    }

    setError('');

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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!imageData) {
      setError('Please upload an image first.');
      return;
    }
    if (hasReachedLimit(TOOL_SLUG)) {
      setError('You\'ve reached your daily limit of 5 free analyses. Try again tomorrow!');
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setResult(data.prompt);
      recordUse(TOOL_SLUG);
      forceUpdate((n) => n + 1);
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout
      toolName="Image to Prompt"
      toolSlug={TOOL_SLUG}
      title="Image to Prompt"
      description="Upload any AI-generated image and get the reverse-engineered prompt that could recreate it. Formatted for Midjourney."
      accentColor="#10b981"
    >
      <div className="space-y-5">
        {/* Upload Zone */}
        {!preview ? (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-4 p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
              dragOver
                ? 'border-[var(--color-success-green)] bg-[var(--color-success-green)]/5 scale-[1.01]'
                : 'border-white/[0.12] bg-[var(--color-background-card)] hover:border-white/20 hover:bg-[var(--color-background-elevated)]'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              dragOver ? 'bg-[var(--color-success-green)]/20 text-[var(--color-success-green)]' : 'bg-white/5 text-[var(--color-text-muted)]'
            }`}>
              <Upload className="w-7 h-7" />
            </div>
            <div className="text-center">
              <p className="text-[var(--color-text-primary)] font-semibold mb-1">
                {dragOver ? 'Drop image here' : 'Click or drag to upload'}
              </p>
              <p className="text-[var(--color-text-muted)] text-sm">
                JPG, PNG, or WebP • Max 5MB
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
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-[var(--color-background-card)] border border-white/[0.06]">
            <img src={preview} alt="Uploaded preview" className="w-full max-h-[400px] object-contain" />
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/90 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !imageData || hasReachedLimit(TOOL_SLUG)}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-[#10b981] to-[#34d399] text-white text-base font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing Image...
            </>
          ) : (
            <>
              <ImagePlus className="w-5 h-5" />
              Extract Prompt
            </>
          )}
        </button>
      </div>

      {result && <CopyableOutput content={result} targetTool="Midjourney" />}
    </ToolPageLayout>
  );
};
