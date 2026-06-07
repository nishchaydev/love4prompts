import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, User, LogOut, LayoutDashboard, Menu, X,
  Wand2, Palette, ArrowRightLeft, Image, MessageSquareCode,
  ChevronDown, Star,
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';
import { TrendingDropdown } from './TrendingDropdown';

// ─── Tools dropdown items ────────────────────────────────────────────
const TOOLS = [
  { label: 'Prompt Enhancer', href: '/tools/prompt-enhancer', icon: Wand2, color: '#D83F87' },
  { label: 'Prompt Maker', href: '/tools/prompt-maker', icon: Sparkles, color: '#6B4DB3' },
  { label: 'Prompt Translator', href: '/tools/prompt-translator', icon: ArrowRightLeft, color: '#A4B3B6' },
  { label: 'Image to Prompt', href: '/tools/image-to-prompt', icon: Image, color: '#E98074' },
  { label: 'Prompt to Image', href: '/tools/prompt-to-image', icon: Palette, color: '#44318D' },
];

export const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);

  // ── Auth session ─────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Scroll detection for border ──────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close tools dropdown on outside click ────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full bg-[#131316]/80 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-[#131316]/60 transition-all duration-300"
        style={{
          borderBottom: scrolled
            ? '1px solid rgba(139,92,246,0.2)'
            : '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-purple)] flex items-center justify-center shadow-[0_0_20px_var(--color-primary-glow)] border border-white/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <a href="/" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-sans">
              iloveprompts
            </a>
          </div>

          {/* Desktop Nav — 3 items */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {/* Tools dropdown */}
            <div ref={toolsRef} className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                  toolsDropdownOpen
                    ? 'bg-white/10 text-white'
                    : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                }`}
              >
                Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${toolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 bg-[#1a1a20]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.7)] overflow-hidden py-2 animate-in fade-in slide-in-from-top-3 duration-200">
                  {TOOLS.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <a
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white transition-colors no-underline"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${tool.color}15` }}
                        >
                          <Icon className="w-4 h-4" style={{ color: tool.color }} />
                        </div>
                        {tool.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Library */}
            <a
              href="/#library"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            >
              Library
            </a>

            {/* Trending */}
            <TrendingDropdown />

            {/* Pro */}
            <a
              href="/pricing"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
            >
              Pro
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#f97316] text-[10px] text-white font-bold leading-none">
                ⭐
              </span>
            </a>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3 relative">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <Avatar size="sm" src={session.user.user_metadata?.avatar_url} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#1a1a20] border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden py-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                      <p className="text-sm font-semibold truncate text-white">{session.user.user_metadata?.user_name || session.user.email}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Creator Account</p>
                    </div>
                    <div className="p-1">
                      <a href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <LayoutDashboard className="w-4 h-4 text-gray-400" /> Dashboard
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl text-red-400 hover:bg-red-500/10 transition-colors text-left mt-1"
                      >
                        <LogOut className="w-4 h-4 text-red-400" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-gray-100 text-gray-900 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              >
                <User className="w-4 h-4" />
                <span className="text-sm font-bold tracking-wide">Sign In</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#131316]/95 backdrop-blur-xl px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {/* Tools section */}
              <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-widest">Tools</div>
              {TOOLS.map((tool) => {
                const Icon = tool.icon;
                return (
                  <a
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
                  >
                    <Icon className="w-4 h-4" style={{ color: tool.color }} />
                    {tool.label}
                  </a>
                );
              })}
              <div className="h-px bg-white/10 my-2" />
              <a
                href="/#library"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
              >
                Library
              </a>
              <a
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline text-[var(--color-text-muted)] hover:text-white hover:bg-white/5"
              >
                ⭐ Pro
              </a>
            </nav>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};
