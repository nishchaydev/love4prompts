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
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled
            ? 'py-2 px-3 sm:py-3 sm:px-6'
            : 'py-4 px-4 sm:px-8'
        }`}
      >
        <div 
          className={`container mx-auto max-w-[1200px] transition-all duration-500 flex items-center justify-between ${
            scrolled
              ? 'bg-[#0A0118]/80 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] px-4 sm:px-6 h-14'
              : 'bg-transparent border border-transparent px-2 h-16'
          }`}
        >
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline group select-none">
            <img 
              src="/logo-icon.png" 
              alt="Love4Prompts Logo" 
              width={38}
              height={38}
              className="h-9 md:h-10 w-auto object-contain transition-all duration-500 group-hover:scale-105 group-hover:rotate-[15deg]" 
            />
            <span className="text-lg md:text-xl font-black font-display tracking-tight text-white transition-colors">
              Love4<span className="text-[var(--color-primary)] group-hover:text-[var(--color-primary-hover)] transition-colors duration-300">Prompts</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-6">
            <a 
              href="/#library" 
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] transition-all duration-200 no-underline"
            >
              Library
            </a>
            <a 
              href="/pricing" 
              className="px-4 py-1.5 rounded-full text-[13px] font-semibold text-white/50 hover:text-white hover:bg-white/[0.03] border border-transparent hover:border-white/[0.04] transition-all duration-200 no-underline"
            >
              Pro
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center p-0.5 rounded-full hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/10"
                >
                  <Avatar size="sm" src={session.user.user_metadata?.avatar_url} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-[#120A24]/95 backdrop-blur-xl border border-white/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] py-2 z-50 animate-fade-in-up">
                    <div className="px-4 py-2.5 border-b border-white/[0.04]">
                      <p className="text-[13px] font-semibold text-white truncate">{session.user.user_metadata?.user_name || session.user.email}</p>
                      <p className="text-[10px] text-white/35 mt-0.5 font-mono">Creator Account</p>
                    </div>
                    <a href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/50 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">
                      <LayoutDashboard className="w-4 h-4 text-white/30" /> Dashboard
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
                className="hidden md:flex items-center gap-1.5 px-4.5 py-1.5 rounded-full bg-white/5 hover:bg-[var(--color-primary)]/10 border border-white/10 hover:border-[var(--color-primary)]/40 text-white text-[13px] font-bold hover:shadow-[0_0_20px_var(--color-primary-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.03] transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border border-white/[0.06] rounded-2xl bg-[#120A24]/95 backdrop-blur-md px-4 py-4 mt-2 mx-3 shadow-[0_12px_40px_rgba(0,0,0,0.6)] animate-fade-in-up">
            <nav className="flex flex-col gap-1">
              <span className="px-3 py-1.5 text-[9px] font-bold text-white/20 uppercase tracking-widest font-mono">Tools Menu</span>
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a key={tool.href} href={tool.href} onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline"
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
              
              {session ? (
                <>
                  <div className="h-px bg-white/[0.04] my-2" />
                  <div className="px-3 py-2">
                    <p className="text-[11px] font-mono text-white/35 truncate">Logged in as {session.user.user_metadata?.user_name || session.user.email}</p>
                  </div>
                  <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">
                    <LayoutDashboard className="w-4 h-4 text-white/30" /> Dashboard
                  </a>
                  <button
                    onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-red-400/60 hover:text-red-400 hover:bg-red-500/5 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-white/[0.04] my-2" />
                  <div className="px-3 py-1.5">
                    <button
                      onClick={() => { setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-cerise)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all duration-250 shadow-[0_4px_20px_var(--color-primary-glow)] cursor-pointer"
                    >
                      Sign In / Sign Up
                    </button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
