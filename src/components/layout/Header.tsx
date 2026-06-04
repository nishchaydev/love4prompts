import React, { useState, useEffect } from 'react';
import { Sparkles, User, Search, LogOut, LayoutDashboard, Wrench, BookOpen, Menu, X } from 'lucide-react';
import { AuthModal } from '../auth/AuthModal';
import { supabase } from '../../lib/supabase';
import { Avatar } from '../ui/Avatar';

export const Header: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const navItems = [
    { label: 'Tools', href: '/tools', icon: Wrench, isActive: currentPath.startsWith('/tools') },
    { label: 'Library', href: '/#library', icon: BookOpen, isActive: currentPath === '/' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-[#050505]/70 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)] supports-[backdrop-filter]:bg-[#050505]/50">
        <div className="container mx-auto px-4 lg:px-8 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-purple)] flex items-center justify-center shadow-[0_0_20px_var(--color-primary-glow)] border border-white/20">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <a href="/tools" className="text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-sans">
              ViralPrompt
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline ${
                    item.isActive
                      ? 'bg-white/10 text-white'
                      : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </a>
              );
            })}
          </nav>
          
          {/* Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 transition-colors group-focus-within:text-[var(--color-primary)]" />
              <input 
                type="text" 
                placeholder="Search viral prompts..." 
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-transparent transition-all duration-300 placeholder:text-gray-500"
              />
            </div>
          </div>

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
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50"
                >
                  <Avatar size="sm" src={session.user.user_metadata?.avatar_url} />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#111] border border-white/10 rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden py-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200">
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
          <div className="md:hidden border-t border-white/10 bg-[#050505]/95 backdrop-blur-xl px-4 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors no-underline ${
                      item.isActive
                        ? 'bg-white/10 text-white'
                        : 'text-[var(--color-text-muted)] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </a>
                );
              })}
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

