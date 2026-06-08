import { useState, useEffect } from 'react';
import { Settings, Sparkles, Code, AlignLeft } from 'lucide-react';

const MODES = [
  { id: 'COSTAR', label: 'COSTAR Framework', icon: <Sparkles size={16} /> },
  { id: 'Token Optimizer', label: 'Token Optimizer', icon: <AlignLeft size={16} /> },
  { id: 'Coding', label: 'Coding / Technical', icon: <Code size={16} /> }
];

export default function Popup() {
  const [mode, setMode] = useState('COSTAR');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['enhancementMode'], (result: any) => {
      if (result.enhancementMode) {
        setMode(result.enhancementMode);
      }
    });
  }, []);

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    chrome.storage.local.set({ enhancementMode: newMode }, () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 font-sans p-4">
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
        <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Sparkles className="text-white" size={18} />
        </div>
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Love4Prompts
        </h1>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-400 mb-3 flex items-center gap-2">
            <Settings size={14} />
            Default Enhancement Mode
          </h2>
          
          <div className="space-y-2">
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  mode === m.id
                    ? 'bg-indigo-950/50 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {m.icon}
                <span className="font-medium text-sm">{m.label}</span>
                {mode === m.id && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {saved && (
          <p className="text-xs text-green-400 text-center animate-pulse">
            Settings saved!
          </p>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800 text-center">
        <p className="text-xs text-slate-500">
          Hover over textareas on ChatGPT, Claude, or Gemini to see the Enhance button.
        </p>
      </div>
    </div>
  );
}
