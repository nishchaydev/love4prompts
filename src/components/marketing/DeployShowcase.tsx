import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Database, ArrowRight, Check, Copy, Settings, Workflow } from 'lucide-react';

const API_SUBTABS = [
  { id: 'run', label: 'Run Prompt' },
  { id: 'return', label: 'Return Prompt' },
  { id: 'all', label: 'Return All Prompts' },
];

const CODE_EXAMPLES = {
  run: {
    method: 'POST',
    url: 'https://api.love4prompts.com/v1/prompts/pr_901a/run',
    code: `{
  "variables": {
    "topic": "artificial-intelligence",
    "tone": "visionary"
  },
  "config": {
    "temperature": 0.7,
    "max_tokens": 1024
  }
}`,
  },
  return: {
    method: 'GET',
    url: 'https://api.love4prompts.com/v1/prompts/pr_901a',
    code: `{
  "data": {
    "id": "pr_901a",
    "name": "GPT Optimizer",
    "prompt": "Act as an expert copywriter. Write a post about {{topic}} in a {{tone}} tone.",
    "version": "v1.4",
    "author": "PromptMaster"
  }
}`,
  },
  all: {
    method: 'GET',
    url: 'https://api.love4prompts.com/v1/prompts?limit=10',
    code: `{
  "data": [
    {
      "id": "pr_1",
      "name": "Midjourney Cinematic",
      "tags": ["art", "v6"]
    },
    {
      "id": "pr_2",
      "name": "Claude Code Refactor",
      "tags": ["coding", "react"]
    }
  ],
  "has_more": false
}`,
  },
};

export const DeployShowcase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'api' | 'forms' | 'zapier'>('api');
  const [activeSubtab, setActiveSubtab] = useState<'run' | 'return' | 'all'>('run');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy =
      activeTab === 'api'
        ? `${CODE_EXAMPLES[activeSubtab].method} ${CODE_EXAMPLES[activeSubtab].url}\n\n${CODE_EXAMPLES[activeSubtab].code}`
        : '';
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section className="py-24 border-t border-white/[0.03] relative overflow-hidden bg-[#0A0118]/20">
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Tagline & Title */}
        <div className="mb-16 text-center md:text-left">
          <p className="text-[11px] font-bold text-[var(--color-primary)] uppercase tracking-[0.2em] mb-3 font-mono">
            Deploy & Integrate
          </p>
          <h2 className="text-3xl md:text-[44px] font-black text-white tracking-[-0.04em] leading-tight max-w-[650px]">
            Seamlessly deploy prompts to all your production apps
          </h2>
          <p className="text-white/45 text-sm mt-3 max-w-[500px]">
            Integrate prompts into your software using our robust API, build shareable client forms, or hook them directly into Zapier automations.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-white/[0.04] mb-8 gap-6 justify-center md:justify-start">
          {(['api', 'forms', 'zapier'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-[14px] font-bold tracking-tight transition-all relative capitalize ${
                activeTab === tab ? 'text-white' : 'text-white/40 hover:text-white/70'
              }`}
            >
              {tab === 'api' ? 'API Integration' : tab === 'forms' ? 'Public Forms' : 'Zapier Workflows'}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)]"
                  layoutId="activeTabUnderline"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Side: Descriptions / Configuration */}
          <div className="lg:col-span-5 flex flex-col justify-between py-2">
            <div>
              <AnimatePresence mode="wait">
                {activeTab === 'api' && (
                  <motion.div
                    key="api-desc"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-[var(--color-primary)]" />
                      Production-Grade REST API
                    </h3>
                    <p className="text-[13.5px] text-white/40 leading-relaxed mb-6">
                      Pull dynamically formatted prompts directly into your backend code. Inject variables at runtime and get fully resolved prompts with model-optimized configs.
                    </p>

                    {/* Sub-tabs for API */}
                    <div className="flex flex-col gap-2 bg-[#0A0118]/80 border border-white/[0.03] p-1.5 rounded-2xl">
                      {API_SUBTABS.map((subtab) => (
                        <button
                          key={subtab.id}
                          onClick={() => setActiveSubtab(subtab.id as any)}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[12.5px] font-semibold transition-all duration-150 flex items-center justify-between ${
                            activeSubtab === subtab.id
                              ? 'bg-white/[0.05] text-white'
                              : 'text-white/40 hover:text-white/60 hover:bg-white/[0.01]'
                          }`}
                        >
                          <span>{subtab.label}</span>
                          {activeSubtab === subtab.id && <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'forms' && (
                  <motion.div
                    key="forms-desc"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                        <Database className="w-5 h-5 text-[var(--color-primary)]" />
                        Interactive Shareable Forms
                      </h3>
                      <p className="text-[13.5px] text-white/40 leading-relaxed mb-6">
                        Deploy your prompts as clean, hosted web forms with a single click. Share forms with clients or team members to let them use complex prompts without exposing the raw logic.
                      </p>
                      <ul className="space-y-3">
                        {[
                          'No-code required to launch form',
                          'Fully responsive and embeddable',
                          'Restrict access with token verification',
                          'Download output generation histories',
                        ].map((item) => (
                          <li key={item} className="flex items-center gap-2.5 text-[12.5px] font-medium text-white/60">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'zapier' && (
                  <motion.div
                    key="zapier-desc"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Workflow className="w-5 h-5 text-[var(--color-primary)]" />
                      Zapier Automation Integrations
                    </h3>
                    <p className="text-[13.5px] text-white/40 leading-relaxed mb-6">
                      Trigger prompts on events across 5,000+ software applications on Zapier. Automatically write drafts, sort support issues, or analyze records when new data appears in your database.
                    </p>
                    <div className="flex flex-col gap-3.5 bg-[#0A0118]/80 border border-white/[0.03] p-4 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[10px] font-bold text-orange-400">Z</div>
                        <span className="text-[12px] font-mono text-white/50">Zapier: Catch Webhook</span>
                      </div>
                      <div className="h-4 w-px bg-white/10 ml-3.5"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[10px] font-bold text-[var(--color-primary)]">L4</div>
                        <span className="text-[12px] font-mono text-white/80 font-bold">Love4Prompts: Run Optimizer</span>
                      </div>
                      <div className="h-4 w-px bg-white/10 ml-3.5"></div>
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-bold text-blue-400">G</div>
                        <span className="text-[12px] font-mono text-white/50">Send Email draft in Gmail</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <a
              href="/tools"
              className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[var(--color-primary)] hover:underline self-start"
            >
              Explore API Docs &rarr;
            </a>
          </div>

          {/* Right Side: Interactive Mockup Terminal */}
          <div className="lg:col-span-7">
            <div className="w-full bg-[#120A24]/60 border border-white/[0.04] rounded-3xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.5)] flex flex-col h-full min-h-[380px]">
              {/* Terminal Title Bar */}
              <div className="px-5 py-4 border-b border-white/[0.04] flex items-center justify-between bg-black/10">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/30"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/30"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/30"></span>
                </div>
                <span className="text-[11px] font-mono text-white/25 uppercase tracking-widest font-bold">
                  {activeTab === 'api' ? 'REST Console' : activeTab === 'forms' ? 'Form Preview' : 'Integration Pipeline'}
                </span>
                {activeTab === 'api' ? (
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-white/5 rounded-lg text-white/35 hover:text-white transition-colors"
                    title="Copy request details"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                ) : (
                  <Settings className="w-4 h-4 text-white/20 animate-spin" style={{ animationDuration: '6s' }} />
                )}
              </div>

              {/* Console Body */}
              <div className="p-6 flex-1 flex flex-col justify-center bg-[#0A0118]/40 font-mono text-[12px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'api' && (
                    <motion.div
                      key={activeSubtab}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                            CODE_EXAMPLES[activeSubtab].method === 'POST'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          }`}
                        >
                          {CODE_EXAMPLES[activeSubtab].method}
                        </span>
                        <span className="text-white/60 select-all truncate">{CODE_EXAMPLES[activeSubtab].url}</span>
                      </div>
                      <div className="border-t border-white/[0.03] pt-4">
                        <pre className="text-white/80 overflow-x-auto whitespace-pre-wrap leading-relaxed select-all">
                          <code>{CODE_EXAMPLES[activeSubtab].code}</code>
                        </pre>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'forms' && (
                    <motion.div
                      key="form-mock"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="space-y-4 font-sans text-left bg-[#0A0118]/80 border border-white/[0.04] p-5 rounded-2xl max-w-[450px] mx-auto"
                    >
                      <h4 className="text-sm font-bold text-white tracking-tight">Generate Blog Ideas</h4>
                      <p className="text-[12px] text-white/40">Enter variables below to generate your copywriting prompt output.</p>
                      
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1">Target Topic</label>
                          <input type="text" placeholder="e.g. Sustainable lifestyle" className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2 text-[12px] text-white outline-none focus:border-[var(--color-primary)]/40" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-white/30 block mb-1">Brand Tone</label>
                          <select className="w-full bg-white/5 border border-white/[0.06] rounded-xl px-3 py-2 text-[12px] text-white/60 outline-none focus:border-[var(--color-primary)]/40">
                            <option>Professional</option>
                            <option>Playful & Witty</option>
                            <option>Inspirational</option>
                          </select>
                        </div>
                      </div>

                      <button className="w-full mt-4 py-2.5 rounded-xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[12.5px] font-bold transition-all shadow-[0_0_15px_var(--color-primary-glow)]">
                        Generate Prompt Output
                      </button>
                    </motion.div>
                  )}

                  {activeTab === 'zapier' && (
                    <motion.div
                      key="zapier-mock"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="text-center font-sans space-y-6 max-w-[420px] mx-auto"
                    >
                      <div className="flex justify-center gap-6 items-center">
                        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-black text-xl shadow-[0_0_20px_rgba(249,115,22,0.1)]">
                          Z
                        </div>
                        <div className="h-px w-12 bg-gradient-to-r from-orange-500 to-[var(--color-primary)] relative">
                          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white animate-ping"></span>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 flex items-center justify-center text-[var(--color-primary)] font-black text-xl shadow-[0_0_20px_var(--color-primary-glow)]">
                          L4
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white tracking-tight">Automate Support Triaging</h4>
                        <p className="text-[12.5px] text-white/40 leading-relaxed">
                          Whenever a new support ticket arrives in Zendesk, Zapier routes it to Love4Prompts' classifier template, outputs the result, and writes a draft reply instantly.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
