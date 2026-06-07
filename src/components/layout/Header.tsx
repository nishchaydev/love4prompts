import React, { useState, useEffect, useRef } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  User, LogOut, LayoutDashboard, Menu, X,
  Wand2, Sparkles, ArrowRightLeft, Image, Palette,
  ChevronDown,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

const TOOLS = [
  { label: 'Prompt Enhancer', href: '/tools/prompt-enhancer', icon: Wand2, desc: 'Optimize & polish prompts for all models' },
  { label: 'Prompt Maker', href: '/tools/prompt-maker', icon: Sparkles, desc: 'Generate high-quality custom prompts' },
  { label: 'Prompt Translator', href: '/tools/prompt-translator', icon: ArrowRightLeft, desc: 'Convert prompts between platforms' },
  { label: 'Image to Prompt', href: '/tools/image-to-prompt', icon: Image, desc: 'Extract descriptive prompts from images' },
  { label: 'Prompt to Image', href: '/tools/prompt-to-image', icon: Palette, desc: 'Generate visual art from text' },
];

export const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    
    return () => {
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('open-auth-modal', handleOpenAuth);
    };
  }, []);

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#0A0118]/80 backdrop-blur-xl border-b border-white/[0.05] shadow-[0_4px_30px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 h-[var(--header-height)] flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline group">
            <img 
              src="/logo-icon.png" 
              alt="Love4Prompts Logo" 
              className="h-10 md:h-11 w-auto object-contain transition-all duration-300 group-hover:scale-105" 
            />
            <span className="text-xl md:text-2xl font-black font-display tracking-tight text-white transition-colors">
              Love4<span className="text-[var(--color-primary)]">Prompts</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1.5 ml-8">
            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ${
                  toolsDropdownOpen 
                    ? 'bg-white/[0.08] text-white border border-white/[0.08]' 
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-3 w-80 bg-[#120A24]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden py-2 z-50 flex flex-col">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <a
                        key={tool.href}
                        href={tool.href}
                        className="flex items-start gap-3.5 px-4 py-3 text-left hover:bg-white/[0.03] transition-all no-underline group"
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-white/[0.03] group-hover:bg-[var(--color-primary)]/10 text-white/40 group-hover:text-[var(--color-primary)] transition-all">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-bold text-white/70 group-hover:text-white transition-colors">{tool.label}</span>
                          <span className="text-[11px] text-white/30 group-hover:text-white/45 transition-colors mt-0.5 leading-normal">{tool.desc}</span>
                        </div>
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            <a href="/#library" className="px-4 py-2 rounded-full text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.04] transition-all no-underline">
              Library
            </a>
            <a href="/pricing" className="px-4 py-2 rounded-full text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.04] transition-all no-underline">
              Pro
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.03] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center p-1 rounded-full hover:bg-white/[0.05] transition-colors"
                >
                  <Avatar size="sm" src={session.user.user_metadata?.avatar_url} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#120A24]/95 backdrop-blur-xl border border-white/[0.06] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-white/[0.04]">
                      <p className="text-[13px] font-semibold text-white truncate">{session.user.user_metadata?.user_name || session.user.email}</p>
                      <p className="text-[11px] text-white/30 mt-0.5 font-mono">Creator Account</p>
                    </div>
                    <a href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-cerise)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all duration-250 shadow-[0_4px_20px_var(--color-primary-glow)]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.04] bg-[#120A24]/95 backdrop-blur-md px-4 py-4">
            <nav className="flex flex-col gap-1">
              <span className="px-3 py-1.5 text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">Tools</span>
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a key={tool.href} href={tool.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline animate-fade-in-up"
                  >
                    <Icon className="w-4 h-4 text-white/30" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white/80">{tool.label}</span>
                      <span className="text-[10px] text-white/30 mt-0.5">{tool.desc}</span>
                    </div>
                  </a>
                );
              })}
              <div className="h-px bg-white/[0.04] my-2" />
              <a href="/#library" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">Library</a>
              <a href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">Pro</a>
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
