import React, { useState, useEffect, useRef } from 'react';
import { motion, LayoutGroup } from 'framer-motion';
import type { Session } from '@supabase/supabase-js';
import {
  User, LogOut, LayoutDashboard, Menu, X, ArrowLeft,
  Wand2, Sparkles, Image, Palette,
  ChevronDown, Puzzle
} from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

const TOOLS = [
  { label: 'Prompt Enhancer', href: '/tools/prompt-enhancer', icon: Wand2, desc: 'Optimize & polish prompts for all models' },
  { label: 'Prompt Maker', href: '/tools/prompt-maker', icon: Sparkles, desc: 'Generate high-quality custom prompts' },

  { label: 'Image to Prompt', href: '/tools/image-to-prompt', icon: Image, desc: 'Extract descriptive prompts from images' },
  { label: 'Prompt to Image', href: '/tools/prompt-to-image', icon: Palette, desc: 'Generate visual art from text' },
  { label: 'Chrome Extension', href: '/extension', icon: Puzzle, desc: 'Use AI prompts anywhere on the web' },
];

export const Header: React.FC<{ isEditorial?: boolean, currentPath?: string }> = ({ isEditorial = false, currentPath = '/' }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState(currentPath);
  const [activeHash, setActiveHash] = useState('');
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

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
    setActiveHash(window.location.hash);
    const handlePageLoad = () => {
      setActivePath(window.location.pathname);
      setActiveHash(window.location.hash);
    };
    const handleHashChange = () => setActiveHash(window.location.hash);
    
    document.addEventListener('astro:page-load', handlePageLoad);
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      document.removeEventListener('astro:page-load', handlePageLoad);
      window.removeEventListener('hashchange', handleHashChange);
    };
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
    localStorage.removeItem('demo_auth');
    await supabase.auth.signOut();
    setProfileDropdownOpen(false);
    window.location.href = '/';
  };

  /* ═══ EDITORIAL NAV — ILOVEPROMPTS style ═══ */
  if (isEditorial) {
    return (
      <>
      <LayoutGroup>
        <nav 
          onMouseLeave={() => setHoveredPath(null)}
          className="bg-transparent text-black flex justify-between items-center px-4 md:px-[40px] w-full h-20 absolute top-0 z-50"
        >
          {/* Logo */}
          <a 
            href="/" 
            onMouseEnter={() => setHoveredPath('/')}
            className="font-black tracking-tighter no-underline flex items-center relative pb-1" 
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(28px, 6vw, 42px)', lineHeight: '1' }}
          >
            {"love4prompts".split('').map((char, index) => (
              <span 
                key={index} 
                className={`inline-block transition-all duration-300 ease-out hover:-translate-y-1 ${
                  char === '4' ? 'text-[#FF6D87] hover:text-black' : 'text-black hover:text-[#FF6D87]'
                }`}
              >
                {char}
              </span>
            ))}
            {((hoveredPath === '/' || (!hoveredPath && activePath === '/'))) && (
              <motion.div
                layoutId="nav-indicator"
                className="absolute -bottom-1 left-0 right-0 h-[4px] bg-[#FF6D87]"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </a>

          {/* Right Side - Nav Links + User Actions */}
          <div className="flex items-center gap-12">
            {/* Desktop Nav Links */}
            <div className="hidden md:flex space-x-6 lg:space-x-10 relative">
              {[
                { name: 'Library', path: '/library', match: (p: string) => p.startsWith('/library') },
                { name: 'Categories', path: '/categories', match: (p: string) => p.startsWith('/categories') },
                { name: 'Tools', path: '/tools', match: (p: string) => p.startsWith('/tools') || p.endsWith('-generator') || p === '/image-to-prompt' || p === '/prompt-to-image' },
                { name: 'Plug & Play', path: '/extension', match: (p: string) => p.startsWith('/extension') },
                { name: 'Submit Trend', path: '/submit', match: (p: string) => p.startsWith('/submit') },
                { name: 'About', path: '/about', match: (p: string) => p.startsWith('/about') }
              ].map((item) => {
                const isActive = item.match(activePath);
                const isHovered = hoveredPath === item.path;
                const isNavIndicatorTarget = hoveredPath ? isHovered : isActive;

                return (
                  <a 
                    key={item.name}
                    href={item.path} 
                    onMouseEnter={() => setHoveredPath(item.path)}
                    className={`ed-label-caps no-underline pb-1 uppercase transition-colors relative group ${isActive || isHovered ? 'text-black' : 'text-[#4c4546]'}`}
                  >
                    {item.name}
                    {isNavIndicatorTarget && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#FF6D87]"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* User or LOGIN */}
            <div className="flex items-center space-x-4">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="hover:text-[#FF6D87] transition-colors cursor-pointer"
                  >
                    <Avatar size="sm" src={session.user.user_metadata?.avatar_url} className="border-[2px] border-black bg-[#FF6D87] text-white hover:bg-black transition-colors" />
                  </button>
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white border border-black shadow-[4px_4px_0_#000] z-50">
                      <div className="px-4 py-2.5 border-b border-black">
                        <p className="ed-label-ui font-bold text-black truncate">{session.user.user_metadata?.user_name || session.user.email}</p>
                      </div>
                      <a href="/dashboard" className="flex items-center gap-2.5 px-4 py-2.5 ed-label-caps text-[#4c4546] hover:bg-black hover:text-white transition-colors no-underline">
                        Dashboard
                      </a>
                      <a href="/settings" className="flex items-center gap-2.5 px-4 py-2.5 ed-label-caps text-[#4c4546] hover:bg-black hover:text-white transition-colors no-underline">
                        Settings
                      </a>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 ed-label-caps text-[#FF6D87] hover:bg-[#FF6D87] hover:text-white transition-colors text-left cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="bg-[#FF6D87] text-white px-[12px] py-[6px] md:px-[20px] md:py-[10px] ed-label-caps tracking-widest text-[10px] md:text-[12px] hover:bg-black transition-colors font-bold uppercase no-underline inline-block"
                >
                  LOGIN
                </a>
              )}
              
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden hover:text-[#FF6D87] transition-colors cursor-pointer ml-4"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </LayoutGroup>

        {/* Mobile Nav for Editorial */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b-[4px] border-black absolute top-20 left-0 w-full z-40 px-6 py-6 flex flex-col gap-5 shadow-[0_8px_0_#000]">
            <a href="/library" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/library') ? 'text-[#FF6D87]' : 'text-black'}`}>Library</a>
            <a href="/categories" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/categories') ? 'text-[#FF6D87]' : 'text-black'}`}>Categories</a>
            <a href="/tools" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/tools') ? 'text-[#FF6D87]' : 'text-black'}`}>Tools</a>
            <a href="/extension" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/extension') ? 'text-[#FF6D87]' : 'text-black'}`}>Plug & Play</a>
            <a href="/submit" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/submit') ? 'text-[#FF6D87]' : 'text-black'}`}>Submit Trend</a>
            <a href="/about" onClick={() => setMobileMenuOpen(false)} className={`font-black text-[18px] tracking-tight no-underline uppercase transition-all active:scale-95 ${currentPath.startsWith('/about') ? 'text-[#FF6D87]' : 'text-black'}`}>About</a>
          </div>
        )}
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
        />
      </>
    );
  }

  /* ═══ DEFAULT NAV — Dark theme ═══ */
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
          {/* Mobile Back Button */}
          {currentPath !== '/' && (
            <button 
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  window.location.href = '/';
                }
              }} 
              className="md:hidden flex items-center justify-center p-1.5 mr-1 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 no-underline group select-none flex-1">
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
              href="/library" 
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
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[15px] font-medium text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline"
                  >
                    <Icon className="w-5 h-5 text-white/30" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-white/80">{tool.label}</span>
                      <span className="text-[11px] text-white/30 mt-0.5">{tool.desc}</span>
                    </div>
                  </a>
                );
              })}
              <div className="h-px bg-white/[0.04] my-2" />
              <a href="/library" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-[15px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">Library</a>
              <a href="/pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2.5 rounded-xl text-[15px] font-semibold text-white/60 hover:text-white hover:bg-white/[0.03] transition-colors no-underline">Pro</a>
              
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
                    <a
                      href="/login"
                      data-astro-reload
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-cerise)] text-white text-[13px] font-bold hover:brightness-110 active:scale-95 transition-all duration-250 shadow-[0_4px_20px_var(--color-primary-glow)] cursor-pointer no-underline"
                    >
                      LOGIN
                    </a>
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
