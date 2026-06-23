import React, { useState, useEffect, useRef } from 'react';
import { motion, LayoutGroup, AnimatePresence } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import {
  User, LogOut, LayoutDashboard, Menu, X, ArrowLeft,
  Wand2, Sparkles, Image, Palette, Puzzle, ChevronDown,
  Flame, TrendingUp
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

const NAV_LINKS = [
  { name: 'Trends', path: '/', match: (p: string) => p === '/' },
  { name: 'Library', path: '/library', match: (p: string) => p.startsWith('/library') },
  { name: 'Tools', path: '/tools', match: (p: string) => p.startsWith('/tools') || p.endsWith('-generator') },
  { name: 'Submit', path: '/submit', match: (p: string) => p.startsWith('/submit') },
];

const TOOLS = [
  { label: 'Prompt Enhancer', href: '/tools/prompt-enhancer', icon: Wand2, desc: 'Optimize & polish prompts' },
  { label: 'Prompt Maker', href: '/tools/prompt-maker', icon: Sparkles, desc: 'Generate custom prompts' },
  { label: 'Image to Prompt', href: '/tools/image-to-prompt', icon: Image, desc: 'Extract prompts from images' },
  { label: 'Prompt to Image', href: '/tools/prompt-to-image', icon: Palette, desc: 'Generate art from text' },
  { label: 'Chrome Extension', href: '/extension', icon: Puzzle, desc: 'AI prompts anywhere on the web' },
];

export const Header: React.FC<{ currentPath?: string }> = ({ currentPath = '/' }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState(currentPath);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && localStorage.getItem('demo_auth') === 'true') {
        setSession({ user: { email: 'demo@love4prompts.com', user_metadata: { user_name: 'Demo User' } } } as any);
      } else {
        setSession(session);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && localStorage.getItem('demo_auth') === 'true') {
        setSession({ user: { email: 'demo@love4prompts.com', user_metadata: { user_name: 'Demo User' } } } as any);
      } else {
        setSession(session);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setActivePath(window.location.pathname);
    const handlePageLoad = () => setActivePath(window.location.pathname);
    document.addEventListener('astro:page-load', handlePageLoad);
    return () => document.removeEventListener('astro:page-load', handlePageLoad);
  }, []);

  useEffect(() => {
    const handleOpenAuth = () => setIsAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  const handleSignOut = async () => {
    if (!window.confirm('Are you sure you want to sign out?')) return;
    localStorage.removeItem('demo_auth');
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-500 ${
          scrolled ? 'py-2 px-3 sm:py-2 sm:px-5' : 'py-3 px-4 sm:px-6'
        }`}
      >
        <div 
          className={`container mx-auto max-w-[1200px] transition-all duration-500 flex items-center justify-between ${
            scrolled
              ? 'bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)] px-4 sm:px-5 h-14'
              : 'bg-transparent border border-transparent px-2 h-16'
          }`}
        >
          {/* Mobile Back Button */}
          {currentPath !== '/' && (
            <button 
              onClick={() => {
                if (window.history.length > 1) window.history.back();
                else window.location.href = '/';
              }} 
              className="md:hidden flex items-center justify-center p-1.5 mr-1 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03] transition-colors cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <a href="/" className="flex items-center gap-2 no-underline group select-none flex-shrink-0">
            <span className="font-[Anton] text-[22px] md:text-[26px] uppercase tracking-wide text-[var(--color-text)] transition-colors leading-none">
              love4<span className="text-[var(--color-primary)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">prompts</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <LayoutGroup>
            <nav 
              onMouseLeave={() => setHoveredPath(null)}
              className="hidden md:flex items-center gap-1 ml-8"
            >
              {NAV_LINKS.map((item) => {
                const isActive = item.match(activePath);
                const isHovered = hoveredPath === item.path;
                const showIndicator = hoveredPath ? isHovered : isActive;

                return (
                  <a 
                    key={item.name}
                    href={item.path} 
                    onMouseEnter={() => setHoveredPath(item.path)}
                    className={`relative px-4 py-1.5 rounded-full text-[13px] font-semibold transition-colors duration-200 no-underline cursor-pointer ${
                      isActive || isHovered
                        ? 'text-[var(--color-text)]'
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {item.name}
                    {showIndicator && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-[var(--color-bg-surface)] border border-[var(--color-border)] rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Right Side */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Trending Badge - Desktop */}
            <a 
              href="/#trends-feed" 
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-[var(--color-primary-surface)] border border-[var(--color-primary)]/30 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/20 transition-all duration-200 no-underline cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              Trending
            </a>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center p-0.5 rounded-full hover:bg-white/[0.05] transition-colors border border-transparent hover:border-[var(--color-border)] cursor-pointer"
                >
                  <Avatar size="sm" src={session.user.user_metadata?.avatar_url} />
                </button>

                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-52 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.1)] py-2 z-50"
                    >
                      <div className="px-4 py-2.5 border-b border-[var(--color-border)]">
                        <p className="text-[13px] font-semibold text-[var(--color-text)] truncate">{session.user.user_metadata?.user_name || session.user.email}</p>
                        <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 font-mono">Creator Account</p>
                      </div>
                      <a href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03] transition-colors no-underline cursor-pointer">
                        <LayoutDashboard className="w-4 h-4 text-[var(--color-text-muted)]" /> Dashboard
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-[var(--color-destructive)]/60 hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/5 transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <a
                  href="/login"
                  className="hidden md:inline-flex items-center text-[13px] font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors no-underline cursor-pointer"
                >
                  Sign In
                </a>
                <a
                  href="/#trends-feed"
                  className="hidden md:inline-flex magnetic-btn items-center gap-1.5 px-5 py-2 rounded-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white text-[13px] font-bold shadow-[0_4px_20px_var(--color-primary-glow)] hover:shadow-[0_8px_30px_var(--color-primary-glow)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 no-underline cursor-pointer"
                >
                  <Flame className="w-4 h-4" />
                  Explore Trends
                </a>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden border border-[var(--color-border)] rounded-2xl bg-[var(--color-bg-elevated)] px-4 py-4 mt-2 mx-3 shadow-[0_12px_40px_rgba(0,0,0,0.1)]"
            >
              <nav className="flex flex-col gap-1">
                {/* Main nav links */}
                {NAV_LINKS.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-[15px] font-semibold transition-colors no-underline cursor-pointer ${
                      item.match(activePath) 
                        ? 'text-[var(--color-text)] bg-white/[0.03]' 
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03]'
                    }`}
                  >
                    {item.name}
                  </a>
                ))}
                
                <div className="h-px bg-[var(--color-border)] my-2" />
                <span className="px-3 py-1 text-[9px] font-bold text-[var(--color-text-muted)] uppercase tracking-widest font-mono">Tools</span>
                
                {TOOLS.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <a key={tool.href} href={tool.href} onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03] transition-colors no-underline cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
                      <div className="flex flex-col">
                        <span className="font-semibold text-[var(--color-text-secondary)]">{tool.label}</span>
                        <span className="text-[11px] text-[var(--color-text-muted)]">{tool.desc}</span>
                      </div>
                    </a>
                  );
                })}

                <div className="h-px bg-[var(--color-border)] my-2" />
                
                {session ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-[11px] font-mono text-[var(--color-text-muted)] truncate">{session.user.user_metadata?.user_name || session.user.email}</p>
                    </div>
                    <a href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-white/[0.03] transition-colors no-underline cursor-pointer">
                      <LayoutDashboard className="w-4 h-4 text-[var(--color-text-muted)]" /> Dashboard
                    </a>
                    <button
                      onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-[var(--color-destructive)]/60 hover:text-[var(--color-destructive)] hover:bg-[var(--color-destructive)]/5 transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="px-3 py-1.5">
                    <a
                      href="/login"
                      data-astro-reload
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all duration-250 shadow-[0_4px_20px_var(--color-primary-glow)] no-underline cursor-pointer"
                    >
                      Sign In
                    </a>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};
