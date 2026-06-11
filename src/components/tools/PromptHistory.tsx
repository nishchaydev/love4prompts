import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, X, Copy, Check, Trash2 } from 'lucide-react';

interface HistoryEntry {
  input: string;
  output: string;
  tool: string;
  model?: string;
  timestamp: number;
}

const STORAGE_KEY = 'l4p_tool_history';

/** Get all history entries from localStorage */
export function getToolHistory(): HistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Save a new entry to tool history */
export function saveToHistory(entry: Omit<HistoryEntry, 'timestamp'>) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getToolHistory();
    const filtered = existing.filter(
      (e) => e.input.toLowerCase() !== entry.input.toLowerCase() || e.tool !== entry.tool
    );
    const newEntry: HistoryEntry = { ...entry, timestamp: Date.now() };
    const updated = [newEntry, ...filtered].slice(0, 30); // keep last 30
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch { /* ignore storage errors */ }
}

/** Clear all tool history */
function clearHistory() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

interface Props {
  toolSlug?: string; // filter to specific tool, or show all
  onReuse?: (entry: HistoryEntry) => void;
}

export const PromptHistory: React.FC<Props> = ({ toolSlug, onReuse }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      const all = getToolHistory();
      setEntries(toolSlug ? all.filter((e) => e.tool === toolSlug) : all);
    }
  }, [isOpen, toolSlug]);

  const handleCopy = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch { /* ignore */ }
  };

  const handleClear = () => {
    clearHistory();
    setEntries([]);
  };

  const toolLabels: Record<string, string> = {
    'prompt-enhancer': 'Enhancer',
    'prompt-translator': 'Translator',
    'prompt-maker': 'Maker',
    'image-to-prompt': 'Img→Prompt',
    'prompt-to-image': 'Prompt→Img',
  };

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;
    return d.toLocaleDateString();
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border-[3px] border-black bg-gray-50 border-[2px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] text-gray-700 hover:text-black hover:border-black transition-all cursor-pointer"
        aria-label="View prompt history"
      >
        <Clock className="w-3 h-3" />
        History
      </button>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[var(--color-background-primary)] border-l border-black border-[2px] shadow-[-8px_0_40px_rgba(0,0,0,0.5)] z-[70] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-black border-[2px]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[var(--color-primary)]" />
                  <h2 className="text-sm font-bold text-black tracking-tight">
                    Prompt History
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-[var(--color-text-muted)] bg-gray-100 border-[2px] border-black">
                    {entries.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {entries.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-white/[0.05] text-black/40 hover:text-black transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Entries */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {entries.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <Clock className="w-8 h-8 text-black/10 mb-3" />
                    <p className="text-[13px] text-black/30 font-medium">No history yet</p>
                    <p className="text-[11px] text-black/15 mt-1">Your prompts will appear here after use</p>
                  </div>
                ) : (
                  entries.map((entry, i) => (
                    <motion.div
                      key={`${entry.timestamp}-${i}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="rounded-xl border-[3px] border-black bg-white shadow-[8px_8px_0_rgba(0,0,0,1)] p-4 group hover:border-black/20 border-[2px] transition-colors"
                    >
                      {/* Meta row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[var(--color-primary-surface)] text-[var(--color-primary)] border border-[var(--color-primary)]/20">
                            {toolLabels[entry.tool] || entry.tool}
                          </span>
                          {entry.model && (
                            <span className="text-[10px] text-black/30 font-mono">{entry.model}</span>
                          )}
                        </div>
                        <span className="text-[10px] text-black/20 font-mono">{formatTime(entry.timestamp)}</span>
                      </div>

                      {/* Input */}
                      <p className="text-[12px] text-black/50 line-clamp-2 mb-2 leading-relaxed">{entry.input}</p>

                      {/* Output preview */}
                      {entry.output && (
                        <p className="text-[12px] text-black/70 line-clamp-3 mb-3 leading-relaxed bg-gray-50 border-[2px] border-black rounded-lg p-2.5 border border-white/[0.03]">
                          {entry.output}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleCopy(entry.output || entry.input, i)}
                          className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-black/40 hover:text-black hover:bg-white/[0.05] transition-all cursor-pointer"
                        >
                          {copiedIdx === i ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                          {copiedIdx === i ? 'Copied' : 'Copy'}
                        </button>
                        {onReuse && (
                          <button
                            onClick={() => { onReuse(entry); setIsOpen(false); }}
                            className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold text-[var(--color-primary)] hover:bg-[var(--color-primary-surface)] transition-all cursor-pointer"
                          >
                            Reuse →
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
