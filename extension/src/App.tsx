import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import './App.css';

function App() {
  const [mode, setMode] = useState('Auto');
  const [tone, setTone] = useState(50);
  const [length, setLength] = useState(50);
  const [memory, setMemory] = useState('');
  const [shadowMode, setShadowMode] = useState(false);
  const [deepThink, setDeepThink] = useState(false);

  // Load from storage
  useEffect(() => {
    chrome.storage.local.get(['enhancementMode', 'tone', 'length', 'memory', 'shadowMode', 'deepThink'], (data) => {
      if (chrome.runtime.lastError) {
        console.error('Failed to load settings:', chrome.runtime.lastError);
        return;
      }
      if (typeof data.enhancementMode === 'string') setMode(data.enhancementMode);
      if (typeof data.tone === 'number') setTone(data.tone);
      if (typeof data.length === 'number') setLength(data.length);
      if (typeof data.memory === 'string') setMemory(data.memory);
      if (typeof data.shadowMode === 'boolean') setShadowMode(data.shadowMode);
      if (typeof data.deepThink === 'boolean') setDeepThink(data.deepThink);
    });
  }, []);

  // Save to storage
  const saveMode = (newMode: string) => {
    setMode(newMode);
    chrome.storage.local.set({ enhancementMode: newMode });
  };

  const saveTone = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setTone(val);
    chrome.storage.local.set({ tone: val });
  };

  const saveLength = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setLength(val);
    chrome.storage.local.set({ length: val });
  };

  const saveMemory = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setMemory(val);
    chrome.storage.local.set({ memory: val });
  };

  const toggleShadowMode = () => {
    const newVal = !shadowMode;
    setShadowMode(newVal);
    chrome.storage.local.set({ shadowMode: newVal });
  };

  const toggleDeepThink = () => {
    const newVal = !deepThink;
    setDeepThink(newVal);
    chrome.storage.local.set({ deepThink: newVal });
  };

  return (
    <div className="w-80 bg-slate-900 text-slate-100 p-4 font-sans border border-slate-800 rounded-lg shadow-2xl">
      <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          Love4Prompts
        </h1>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Agent Mode (Auto overrides this)
          </label>
          <select 
            value={mode} 
            onChange={(e) => saveMode(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-sm text-slate-200 outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="Auto">Auto-Detect</option>
            <option value="General">General Detail</option>
            <option value="COSTAR">COSTAR Framework</option>
            <option value="Strict Coding">Strict Coding</option>
            <option value="Image Generation">Image Generation</option>
            <option value="Token Optimizer">Token Optimizer</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Tone</span>
            <span className="text-indigo-300">{tone < 30 ? 'Casual' : tone > 70 ? 'Academic' : 'Balanced'}</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={tone}
            onChange={saveTone}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-400 mb-1 font-semibold uppercase tracking-wider">
            <span>Length</span>
            <span className="text-purple-300">{length < 30 ? 'Concise' : length > 70 ? 'Detailed' : 'Balanced'}</span>
          </div>
          <input 
            type="range" 
            min="0" max="100" 
            value={length}
            onChange={saveLength}
            className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">
            Persistent Memory (Global Rules)
          </label>
          <textarea 
            value={memory}
            onChange={saveMemory}
            placeholder="e.g., 'I am a Next.js dev. Always use Tailwind CSS.'"
            className="w-full h-20 bg-slate-800 border border-slate-700 rounded p-2 text-xs text-slate-200 outline-none focus:border-indigo-500 transition-colors resize-none"
          />
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded cursor-pointer mt-3" onClick={toggleShadowMode}>
          <div>
            <div className="text-sm font-semibold text-slate-200">Shadow Mode</div>
            <div className="text-xs text-slate-400">Auto-enhance on Enter (Zero Click)</div>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${shadowMode ? 'bg-indigo-500' : 'bg-slate-600'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${shadowMode ? 'left-6' : 'left-1'}`} />
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-800 border border-slate-700 rounded cursor-pointer mt-3" onClick={toggleDeepThink}>
          <div>
            <div className="text-sm font-semibold text-amber-400 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Deep Think (Multi-Agent)
            </div>
            <div className="text-xs text-slate-400">3-Agent debate (Slower but god-tier)</div>
          </div>
          <div className={`w-10 h-5 rounded-full relative transition-colors ${deepThink ? 'bg-amber-500' : 'bg-slate-600'}`}>
            <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-all ${deepThink ? 'left-6' : 'left-1'}`} />
          </div>
        </div>
      </div>
      <div className="mt-4 text-xs text-slate-500 text-center">
        Tip: Press <strong>Ctrl+Shift+E</strong> to enhance while typing!
      </div>
    </div>
  );
}

export default App;
