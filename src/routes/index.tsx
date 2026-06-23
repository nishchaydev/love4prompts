import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Flame, Menu, Sparkles, X } from "lucide-react";

import {
  CATEGORIES,
  chatGptUrlFor,
  createUrlFor,
  SITE_URL,
  TRENDS,
  type Trend,
} from "@/lib/trends";
import { signOut, useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "love4prompts — Viral AI image trends, ready to recreate." },
      {
        name: "description",
        content:
          "A living library of viral AI image trends. Tap any trend to enlarge it and launch the generator in one click.",
      },
      { property: "og:title", content: "love4prompts — Viral AI image trends, ready to recreate." },
      {
        property: "og:description",
        content:
          "A living library of viral AI image trends. Tap any trend to enlarge it and launch the generator in one click.",
      },
      { property: "og:url", content: `${SITE_URL}/` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Landing,
});

const NAV: { label: string; to: string }[] = [
  { label: "Trends", to: "/trends" },
  { label: "Categories", to: "/categories" },
  { label: "Submit", to: "/submit" },
  { label: "About", to: "/about" },
];

const HERO_DECK: Trend[] = [
  TRENDS[1], // girls
  TRENDS[7], // netflix
  TRENDS[5], // festivals
  TRENDS[3], // ai-art
  TRENDS[6], // posters
  TRENDS[0], // boys
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      <FloatingNav />
      <Hero />
      <LiveTrendsFeed />
      <HowItWorks />
      <SubmitCTA />
      <SiteFooter />
    </div>
  );
}

/* ───────── Reduced-motion: OS preference + manual override ───────── */
const RM_KEY = "love4prompts:reduce-motion";
function getInitialReduced(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(RM_KEY);
  if (stored === "1") return true;
  if (stored === "0") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function useReducedMotion(): [boolean, (v: boolean) => void] {
  const [reduced, setReduced] = useState<boolean>(false);
  useEffect(() => {
    setReduced(getInitialReduced());
    const onChange = () => setReduced(getInitialReduced());
    window.addEventListener("rm-change", onChange);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", onChange);
    return () => {
      window.removeEventListener("rm-change", onChange);
      mq.removeEventListener("change", onChange);
    };
  }, []);
  const setAndBroadcast = (v: boolean) => {
    window.localStorage.setItem(RM_KEY, v ? "1" : "0");
    window.dispatchEvent(new Event("rm-change"));
  };
  return [reduced, setAndBroadcast];
}

/* ───────── Deck auto-shuffle settings ───────── */
type DeckSpeed = "off" | "slow" | "normal" | "fast";
const SPEED_MS: Record<DeckSpeed, number> = { off: 0, slow: 5000, normal: 2800, fast: 1400 };
const DS_SPEED_KEY = "love4prompts:deck-speed";
const DS_LOOP_KEY = "love4prompts:deck-loop";
type DeckSettings = { speed: DeckSpeed; loop: boolean };
function getInitialDeck(): DeckSettings {
  if (typeof window === "undefined") return { speed: "normal", loop: true };
  const s = (window.localStorage.getItem(DS_SPEED_KEY) as DeckSpeed | null) ?? "normal";
  const l = window.localStorage.getItem(DS_LOOP_KEY);
  return { speed: s, loop: l === null ? true : l === "1" };
}
function useDeckSettings(): [DeckSettings, (next: Partial<DeckSettings>) => void] {
  const [s, setS] = useState<DeckSettings>({ speed: "normal", loop: true });
  useEffect(() => {
    setS(getInitialDeck());
    const onChange = () => setS(getInitialDeck());
    window.addEventListener("deck-change", onChange);
    return () => window.removeEventListener("deck-change", onChange);
  }, []);
  const update = (next: Partial<DeckSettings>) => {
    const merged = { ...getInitialDeck(), ...next };
    window.localStorage.setItem(DS_SPEED_KEY, merged.speed);
    window.localStorage.setItem(DS_LOOP_KEY, merged.loop ? "1" : "0");
    window.dispatchEvent(new Event("deck-change"));
  };
  return [s, update];
}

/* ───────── Unified scroll reveal ───────── */
function useScrollRevealed(threshold = 0.18): boolean {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    if (revealed) return;
    let raf = 0;
    const check = () => {
      raf = 0;
      if (window.scrollY > Math.max(40, window.innerHeight * threshold)) {
        setRevealed(true);
      }
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("orientationchange", onScroll);
    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
    };
  }, [revealed, threshold]);
  return revealed;
}

/* ───────── Trend context for lightbox (shared by hero deck + feed) ───────── */
const TrendOpenContext = { current: null as null | ((t: Trend) => void) };
function openTrend(t: Trend) {
  TrendOpenContext.current?.(t);
}

function Spinner({ label }: { label?: string }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="inline-block size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
      />
      {label ? <span className="sr-only">{label}</span> : null}
    </>
  );
}


function FloatingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [ctaIn, setCtaIn] = useState(false);
  const authed = useAuth();
  const navigate = useNavigate();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLAnchorElement | null>(null);
  const catWrapRef = useRef<HTMLLIElement | null>(null);
  const catBtnRef = useRef<HTMLButtonElement | null>(null);
  const catMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileCatBtnRef = useRef<HTMLButtonElement | null>(null);

  // Reveal CTA pill on mount, matching hero text fade-in timing
  useEffect(() => {
    const t = window.setTimeout(() => setCtaIn(true), 80);
    return () => window.clearTimeout(t);
  }, []);
  const ctaStyle: React.CSSProperties = {
    opacity: ctaIn ? 1 : 0,
    transform: ctaIn ? "translateY(0)" : "translateY(-6px)",
    transition: "opacity 520ms ease-out, transform 520ms ease-out",
    willChange: "opacity, transform",
  };

  // Close categories dropdown on outside click + Escape, and trap Tab inside
  useEffect(() => {
    if (!catOpen) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!catWrapRef.current?.contains(e.target as Node)) setCatOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setCatOpen(false);
        catBtnRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const menu = catMenuRef.current;
      if (!menu) return;
      const items = Array.from(
        menu.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      const inMenu = menu.contains(active);
      if (!inMenu) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
        return;
      }
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [catOpen]);

  const handleLogout = () => {
    if (authBusy) return;
    setAuthBusy(true);
    setMenuOpen(false);
    signOut();
    // Wait one tick so the auth-state listener flips before we route home
    window.setTimeout(() => {
      navigate({ to: "/" });
      setAuthBusy(false);
    }, 60);
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    if (authBusy) {
      e.preventDefault();
      return;
    }
    setAuthBusy(true);
    setMenuOpen(false);
    // navigate via Link's default behavior; reset shortly after
    window.setTimeout(() => setAuthBusy(false), 600);
  };



  useEffect(() => {
    if (!menuOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    const t = window.setTimeout(() => firstItemRef.current?.focus(), 20);
    return () => {
      window.clearTimeout(t);
      body.style.overflow = prev.overflow;
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
      triggerRef.current?.focus?.();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const root = panelRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] w-[min(960px,calc(100%-2rem))]">
        <nav className="flex items-center justify-between gap-2 rounded-full border border-border bg-background/85 backdrop-blur-md pl-5 pr-2 py-2 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.15)]">
          <a href="#top" className="flex items-center gap-1.5 font-display font-bold tracking-tight text-base">
            <span className="inline-block size-2 rounded-full bg-foreground" />
            love4prompts
          </a>
          <ul className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((item) =>
              item.to === "/categories" ? (
                <li key={item.to} ref={catWrapRef} className="relative">
                  <button
                    ref={catBtnRef}
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={catOpen}
                    aria-controls="categories-menu"
                    onClick={() => setCatOpen((v) => !v)}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        setCatOpen(true);
                        requestAnimationFrame(() => {
                          catMenuRef.current?.querySelector<HTMLElement>("a")?.focus();
                        });
                      }
                    }}
                    className="px-3 py-1.5 rounded-full text-foreground/70 hover:text-foreground hover:bg-muted transition inline-flex items-center gap-1"
                  >
                    {item.label}
                    <ChevronDown className={`size-3.5 transition-transform ${catOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                  {catOpen && (
                    <div
                      ref={catMenuRef}
                      id="categories-menu"
                      role="menu"
                      aria-label="Categories"
                      onKeyDown={(e) => {
                        const items = Array.from(
                          catMenuRef.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
                        );
                        const idx = items.indexOf(document.activeElement as HTMLAnchorElement);
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          items[Math.min(items.length - 1, idx + 1)]?.focus();
                        } else if (e.key === "ArrowUp") {
                          e.preventDefault();
                          if (idx <= 0) catBtnRef.current?.focus();
                          else items[idx - 1]?.focus();
                        } else if (e.key === "Home") {
                          e.preventDefault();
                          items[0]?.focus();
                        } else if (e.key === "End") {
                          e.preventDefault();
                          items[items.length - 1]?.focus();
                        }
                      }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 w-56 max-h-[60vh] overflow-y-auto rounded-2xl border border-border bg-background shadow-[0_12px_40px_-12px_rgba(0,0,0,0.25)] p-1.5 animate-fade-in"
                    >
                      <Link
                        to="/categories"
                        role="menuitem"
                        onClick={() => setCatOpen(false)}
                        className="block px-3 py-2 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-muted focus:bg-muted focus:text-foreground focus:outline-none"
                      >
                        All categories
                      </Link>
                      {CATEGORIES.map((c) => (
                        <Link
                          key={c}
                          to="/trends"
                          search={{ category: c }}
                          role="menuitem"
                          onClick={() => setCatOpen(false)}
                          className="block px-3 py-2 rounded-xl text-sm text-foreground/70 hover:text-foreground hover:bg-muted focus:bg-muted focus:text-foreground focus:outline-none"
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  )}
                </li>
              ) : (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    activeProps={{ className: "text-foreground bg-muted" }}
                    inactiveProps={{ className: "text-foreground/70" }}
                    activeOptions={{ exact: item.to === "/" }}
                    className="px-3 py-1.5 rounded-full hover:text-foreground hover:bg-muted transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="flex items-center gap-1">
            {authed ? (
              <button
                type="button"
                onClick={handleLogout}
                disabled={authBusy}
                aria-busy={authBusy}
                aria-live="polite"
                aria-label={authBusy ? "Signing out, please wait" : "Log out"}
                style={ctaStyle}
                className="hidden md:inline-flex items-center justify-center gap-1.5 min-w-[96px] rounded-full bg-foreground text-background text-sm font-medium px-4 py-2 hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {authBusy ? <Spinner label="Signing out" /> : "LOGOUT"}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={handleLoginClick}
                aria-busy={authBusy}
                aria-live="polite"
                aria-label={authBusy ? "Opening login, please wait" : "Log in"}
                style={ctaStyle}
                className={`hidden md:inline-flex items-center justify-center gap-1.5 min-w-[96px] rounded-full bg-foreground text-background text-sm font-medium px-4 py-2 hover:opacity-90 transition ${authBusy ? "opacity-70 pointer-events-none" : ""}`}
              >
                {authBusy ? <Spinner label="Opening login" /> : "LOGIN"}
              </Link>
            )}
            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="md:hidden inline-flex items-center justify-center size-10 rounded-full bg-foreground text-background hover:opacity-90 transition"
            >
              {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>


      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-[70] animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Main menu"
          id="mobile-menu"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div
            ref={panelRef}
            className="absolute inset-x-3 top-20 bottom-3 rounded-3xl border border-border bg-background shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <span className="flex items-center gap-1.5 font-display font-bold tracking-tight text-base">
                <span className="inline-block size-2 rounded-full bg-foreground" />
                love4prompts
              </span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="inline-flex items-center justify-center size-10 rounded-full bg-foreground text-background hover:opacity-90 transition"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4">
              <ul className="flex flex-col gap-1">
                {NAV.map((item, idx) =>
                  item.to === "/categories" ? (
                    <li key={item.to}>
                      <button
                        ref={(el) => {
                          mobileCatBtnRef.current = el;
                          if (idx === 0) (firstItemRef as any).current = el;
                        }}
                        type="button"
                        aria-expanded={mobileCatOpen}
                        aria-controls="mobile-cat-list"
                        onClick={() =>
                          setMobileCatOpen((v) => {
                            const next = !v;
                            if (!next) {
                              // returning focus to trigger after collapse
                              requestAnimationFrame(() => mobileCatBtnRef.current?.focus());
                            }
                            return next;
                          })
                        }
                        className="w-full flex items-center justify-between px-4 py-4 rounded-2xl text-2xl font-display font-bold tracking-tight text-foreground hover:bg-muted transition"
                      >
                        <span>{item.label}</span>
                        <ChevronDown className={`size-5 transition-transform ${mobileCatOpen ? "rotate-180" : ""}`} aria-hidden="true" />
                      </button>
                      {mobileCatOpen && (
                        <ul id="mobile-cat-list" className="mt-1 mb-2 ml-2 flex flex-col gap-0.5 animate-fade-in">
                          <li>
                            <Link
                              to="/categories"
                              onClick={() => {
                                setMobileCatOpen(false);
                                setMenuOpen(false);
                              }}
                              className="block px-4 py-2.5 rounded-xl text-base text-foreground/80 hover:bg-muted hover:text-foreground"
                            >
                              All categories
                            </Link>
                          </li>
                          {CATEGORIES.map((c) => (
                            <li key={c}>
                              <Link
                                to="/trends"
                                search={{ category: c }}
                                onClick={() => {
                                  setMobileCatOpen(false);
                                  setMenuOpen(false);
                                }}
                                className="block px-4 py-2.5 rounded-xl text-base text-foreground/80 hover:bg-muted hover:text-foreground"
                              >
                                {c}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ) : (
                    <li key={item.to}>
                      <Link
                        ref={idx === 0 ? (firstItemRef as any) : undefined}
                        to={item.to}
                        onClick={() => setMenuOpen(false)}
                        className="block px-4 py-4 rounded-2xl text-2xl font-display font-bold tracking-tight text-foreground hover:bg-muted transition"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </nav>
            <div className="px-4 py-4 border-t border-border">
              {authed ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={authBusy}
                  aria-busy={authBusy}
                  aria-live="polite"
                  aria-label={authBusy ? "Signing out, please wait" : "Log out"}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-4 py-3.5 hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {authBusy ? <Spinner label="Signing out" /> : "LOGOUT"}
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={handleLoginClick}
                  aria-busy={authBusy}
                  aria-live="polite"
                  aria-label={authBusy ? "Opening login, please wait" : "Log in"}
                  className={`w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background text-sm font-semibold px-4 py-3.5 hover:opacity-90 transition ${authBusy ? "opacity-70 pointer-events-none" : ""}`}
                >
                  {authBusy ? <Spinner label="Opening login" /> : "LOGIN"}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Hero() {
  const [activeTrend, setActiveTrend] = useState<Trend | null>(null);
  const [reduced] = useReducedMotion();
  const [textIn, setTextIn] = useState(false);
  const [deckIn, setDeckIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const t1 = window.setTimeout(() => setTextIn(true), 50);
    const t2 = window.setTimeout(() => setDeckIn(true), 750);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);
  const show = reduced || textIn;
  const showDeck = reduced || deckIn;
  const revealStyle: React.CSSProperties = {
    opacity: show ? 1 : 0,
    transform: show ? "translateY(0)" : "translateY(16px)",
    transition: reduced ? "none" : "opacity 520ms ease-out, transform 520ms ease-out",
    willChange: "opacity, transform",
  };
  const deckStyle: React.CSSProperties = {
    opacity: showDeck ? 1 : 0,
    transform: showDeck ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
    transition: reduced ? "none" : "opacity 700ms ease-out, transform 700ms cubic-bezier(0.32, 0.72, 0, 1)",
    willChange: "opacity, transform",
  };

  // Register global trend opener: mobile → dedicated page, desktop → lightbox
  useEffect(() => {
    TrendOpenContext.current = (t) => {
      const isDesktop =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches;
      if (isDesktop) {
        setActiveTrend(t);
      } else {
        navigate({ to: "/trend/$slug", params: { slug: t.slug } });
      }
    };
    return () => {
      TrendOpenContext.current = null;
    };
  }, [navigate]);




  const focusRing =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  return (
    <section id="top" className="relative overflow-hidden">
      <div
        className="mx-auto max-w-3xl px-6 pt-24 md:pt-28 pb-2 text-center relative z-20"
        style={revealStyle}
      >
        <h2 className="font-display font-black tracking-normal leading-[0.95] text-3xl md:text-5xl uppercase">
          Recreate viral AI image{" "}
          <span className="italic font-light">trends</span> in seconds.
        </h2>
      </div>

      <div className="relative w-full min-h-[68svh] md:min-h-[78svh] overflow-hidden" style={deckStyle}>
        <div className="absolute inset-x-0 top-2 bottom-0 z-0 flex items-center justify-center px-[2vw]">
          <h1
            aria-label="love4prompts"
            className="font-display font-black text-center tracking-[-0.04em] leading-[0.85] select-none text-foreground whitespace-nowrap w-full px-3 overflow-hidden"
            style={{
              fontSize: "clamp(1.75rem, 12.5vw, 12rem)",
              wordBreak: "keep-all",
            }}
          >
            love4prompts
          </h1>
        </div>

        <StackedWindowCards />
      </div>

      <div
        className="mx-auto max-w-3xl px-6 pt-6 md:pt-8 pb-12 md:pb-16 text-center relative z-20"
        style={revealStyle}
      >
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/trends"
            className={`inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-5 py-3 text-sm font-medium hover:opacity-90 transition min-h-11 ${focusRing}`}
          >
            Browse trends
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
          <Link
            to="/submit"
            className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted transition min-h-11 ${focusRing}`}
          >
            Submit a trend
          </Link>
        </div>
      </div>

      <TrendLightbox trend={activeTrend} onClose={() => setActiveTrend(null)} />
    </section>
  );
}


function StackedWindowCards() {
  const [reduced] = useReducedMotion();
  const [order, setOrder] = useState<number[]>(() => HERO_DECK.map((_, i) => i));

  const bringToFront = (idx: number) => {
    setOrder((prev) => {
      if (prev[prev.length - 1] === idx) {
        openTrend(HERO_DECK[idx]);
        return prev;
      }
      const without = prev.filter((i) => i !== idx);
      return [...without, idx];
    });
  };

  useEffect(() => {
    if (reduced) return;
    const ms = 1100;
    let timer: number | undefined;
    const tick = () => {
      if (document.hidden) {
        timer = window.setTimeout(tick, ms);
        return;
      }
      window.requestAnimationFrame(() => {
        setOrder((prev) => {
          const [first, ...rest] = prev;
          return [...rest, first];
        });
        timer = window.setTimeout(tick, ms);
      });
    };
    timer = window.setTimeout(tick, ms);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [reduced]);

  const easing = "cubic-bezier(0.32, 0.72, 0, 1)";
  const visibleOffsets = [
    { x: 0, y: 0, rotate: 0 },
    { x: -18, y: -10, rotate: -2.5 },
    { x: 18, y: 10, rotate: 2.5 },
    { x: -10, y: 8, rotate: -1.4 },
    { x: 10, y: -8, rotate: 1.4 },
  ];

  return (
    <div className="absolute inset-x-0 top-2 bottom-0 z-10 pointer-events-none flex items-center justify-center overflow-visible">
      <div
        data-hero-card-stack
        className="relative aspect-[4/5] pointer-events-auto"
        style={{ width: "min(86vw, calc((100svh - 8.5rem) * 0.8), 390px)" }}
      >
        {HERO_DECK.map((card, i) => {
          const stackPos = order.indexOf(i);
          const fromTop = HERO_DECK.length - 1 - stackPos;
          const visible = fromTop < visibleOffsets.length;
          const offset = visibleOffsets[fromTop] ?? visibleOffsets[visibleOffsets.length - 1];
          const scale = 1 - fromTop * 0.025;
          const isTop = fromTop === 0;
          return (
            <button
              type="button"
              key={card.slug}
              onClick={() => bringToFront(i)}
              aria-label={`Open ${card.title} trend`}
              aria-pressed={isTop}
              aria-hidden={!visible}
              tabIndex={visible ? 0 : -1}

              style={{
                top: "50%",
                opacity: visible ? 1 : 0,
                transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) rotate(${offset.rotate}deg) scale(${scale})`,
                transformOrigin: "center center",
                zIndex: visible ? visibleOffsets.length - fromTop : 0,
                willChange: "transform",
                transition: reduced
                  ? "none"
                  : `transform 900ms ${easing}, opacity 450ms ${easing}, box-shadow 600ms ${easing}`,
              }}
              className="absolute left-1/2 w-full aspect-[4/5] rounded-[1.6rem] shadow-[0_28px_70px_-28px_rgba(0,0,0,0.55)] border border-foreground/10 overflow-hidden cursor-pointer text-left bg-muted hover:shadow-[0_34px_80px_-28px_rgba(0,0,0,0.65)] focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <img
                src={card.img}
                alt={card.title}
                className="size-full object-cover"
                loading={isTop ? "eager" : "lazy"}
              />
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-[10px] uppercase tracking-widest text-white/80">
                  {card.category}
                </div>
                <div className="font-display font-bold text-white text-sm leading-tight">
                  {card.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────── Trend Lightbox: shared by deck + feed ───────── */
function TrendLightbox({ trend, onClose }: { trend: Trend | null; onClose: () => void }) {
  const [reduced] = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const open = trend !== null;

  useEffect(() => {
    if (!open) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      const firstBtn = dialogRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      firstBtn?.focus();
    }, 20);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const root = dialogRef.current;
      if (!root) return;
      const focusables = Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.tabIndex !== -1);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !root.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && trend && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${trend.title} preview`}
          initial={reduced ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8"
        >
          <button
            type="button"
            tabIndex={-1}
            aria-label="Close preview"
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={reduced ? false : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduced ? undefined : { scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden shadow-2xl bg-background flex flex-col md:flex-row"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 inline-flex items-center justify-center size-10 rounded-full bg-background/90 backdrop-blur border border-border hover:bg-muted transition"
            >
              <X className="size-5" />
            </button>

            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[40vh] md:min-h-0">
              <img
                src={trend.img}
                alt={trend.title}
                className="max-h-[92vh] w-full md:w-auto md:max-w-full object-contain"
              />
            </div>

            <div className="md:w-[340px] flex-shrink-0 p-6 md:p-8 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-border">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] uppercase tracking-widest text-foreground/75 border border-border">
                  {trend.category}
                </span>
                {trend.hot && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                    <Flame className="size-3" /> Hot
                  </span>
                )}
              </div>
              <h3 className="font-display font-black tracking-tight text-3xl leading-[1.05]">
                {trend.title}
              </h3>
              <p className="text-sm text-foreground/65">
                Tap the button below to launch this trend in your AI generator. The reference is preloaded — just hit create.
              </p>
              <div className="mt-auto flex flex-col gap-2">
                <a
                  href={chatGptUrlFor(trend.prompt)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-5 py-3.5 text-sm font-semibold hover:opacity-90 transition"
                >
                  <Sparkles className="size-4" /> Create image <ArrowUpRight className="size-4" />
                </a>
                <Link
                  to="/trends"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted transition"
                >
                  Explore more <ArrowUpRight className="size-4" />
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium text-foreground/60 hover:text-foreground transition"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CategoriesStrip() {
  return (
    <section id="categories" className="border-y border-border bg-background py-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">Categories</span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <a
                href="#trends"
                className="inline-block rounded-full border border-border px-4 py-1.5 text-sm hover:bg-foreground hover:text-background hover:border-foreground transition"
              >
                {c}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const HEIGHTS: Record<"sm" | "md" | "lg" | "xl", string> = {
  sm: "h-56",
  md: "h-72",
  lg: "h-96",
  xl: "h-[28rem]",
};

function LiveTrendsFeed() {
  const [reduced] = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showHotOnly, setShowHotOnly] = useState(false);

  const filterCategories = ["All", ...CATEGORIES];

  const visibleTrends = TRENDS.filter(
    (t) => activeCategory === "All" || t.category === activeCategory,
  )
    .filter((t) => !showHotOnly || t.hot)
    .sort((a, b) => Number(b.hot ?? false) - Number(a.hot ?? false));

  return (
    <section id="trends" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground/55 mb-3">
              <span className="relative inline-flex size-2">
                <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-60" />
                <span className="relative inline-flex size-2 rounded-full bg-orange-500" />
              </span>
              Live trends feed
            </div>
            <h2 className="font-display font-black tracking-tight leading-[0.95] text-5xl md:text-7xl max-w-2xl">
              What's <span className="italic font-light">trending</span> right now.
            </h2>
          </div>
          <a href="#submit" className="hidden md:inline-flex items-center gap-1 text-sm border-b border-foreground pb-0.5">
            Submit a trend <ArrowUpRight className="size-4" />
          </a>
        </div>

        {/* Filter chips: Hot toggle + categories */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            type="button"
            onClick={() => setShowHotOnly((v) => !v)}
            aria-pressed={showHotOnly}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-semibold border transition ${
              showHotOnly
                ? "bg-orange-500 text-white border-orange-500"
                : "border-border text-foreground hover:bg-muted"
            }`}
          >
            <Flame className="size-3.5" /> Hot
          </button>
          <span className="mx-1 h-5 w-px bg-border" />
          {filterCategories.map((c) => {
            const active = activeCategory === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setActiveCategory(c)}
                aria-pressed={active}
                className={`inline-block rounded-full border px-4 py-1.5 text-sm transition ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>

        {visibleTrends.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center text-foreground/60">
            No trends match this filter yet. Try turning off Hot or picking another category.
          </div>
        ) : (
          <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {visibleTrends.map((t, i) => (
              <TrendCard
                key={t.slug}
                trend={t}
                index={i}
                reduced={reduced}
                hovered={activeIdx === i}
                onEnter={() => setActiveIdx(i)}
                onLeave={() => setActiveIdx((cur) => (cur === i ? null : cur))}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function TrendCard({
  trend,
  index,
  reduced,
  hovered,
  onEnter,
  onLeave,
}: {
  trend: Trend;
  index: number;
  reduced: boolean;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const revealed = hovered || focused;

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 24 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.32) }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative mb-4 inline-block w-full break-inside-avoid rounded-3xl border border-border bg-card overflow-hidden shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)] transition-shadow"
    >
      <button
        type="button"
        onClick={() => openTrend(trend)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={`Open ${trend.title} trend`}
        className={`relative block w-full ${HEIGHTS[trend.height]} overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground rounded-3xl`}
      >
        <img
          src={trend.img}
          alt={trend.title}
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
          style={{
            transform: revealed && !reduced ? "scale(1.03)" : "scale(1.05)",
            transition: reduced ? "none" : "transform 0.6s ease",
          }}

        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent"
          style={{
            opacity: reduced ? 0.4 : revealed ? 0.45 : 0.7,
            transition: reduced ? "none" : "opacity 0.4s ease",
          }}
        />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-background/85 backdrop-blur px-2.5 py-1 text-[10px] uppercase tracking-widest text-foreground/80 border border-border">
            {trend.category}
          </span>
          {trend.hot && (
            <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
              <Flame className="size-3" /> Hot
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="font-display font-bold text-white text-lg leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]">
            {trend.title}
          </h3>
          <div
            className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white text-black px-3 py-1.5 text-xs font-semibold"
            style={{
              opacity: reduced ? 1 : revealed ? 1 : 0,
              transform: revealed || reduced ? "translateY(0)" : "translateY(8px)",
              transition: reduced ? "none" : "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <Sparkles className="size-3.5" /> Create image
          </div>
        </div>
      </button>
    </motion.article>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", title: "See the trend.", body: "Browse fresh AI image trends, refreshed every day." },
    { n: "02", title: "Click to reveal.", body: "Tap any card to enlarge it full-screen with all the detail." },
    { n: "03", title: "Launch in your AI.", body: "One click opens the generator with the trend loaded. Done." },
  ];
  return (
    <section id="about" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-6">
          How it works
        </div>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          {steps.map((s) => (
            <div key={s.n} className="border-t border-foreground pt-6">
              <div className="font-display text-sm font-medium mb-6">{s.n}</div>
              <h3 className="font-display font-black tracking-tight text-4xl md:text-5xl leading-[0.95] mb-4">
                {s.title}
              </h3>
              <p className="text-foreground/65 max-w-xs">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SubmitCTA() {
  return (
    <section id="submit" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-[2.5rem] bg-foreground text-background px-8 md:px-16 py-16 md:py-24 text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-background/60 mb-6">
            Submit a trend
          </div>
          <h2 className="font-display font-black tracking-tight leading-[0.9] text-5xl md:text-8xl">
            Spotted a <span className="italic font-light">trend?</span>
          </h2>
          <p className="mt-8 mx-auto max-w-xl text-background/70">
            Drop the image and we'll add it to the feed. The best submissions get featured, credited, and rewarded.
          </p>
          <a
            href="#submit"
            className="mt-10 inline-flex items-center gap-1.5 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition"
          >
            Submit a trend <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const cols: { title: string; links: { label: string; to: string }[] }[] = [
    {
      title: "Product",
      links: [
        { label: "Trends", to: "/trends" },
        { label: "Categories", to: "/categories" },
        { label: "Library", to: "/library" },
        { label: "Submit", to: "/submit" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our story", to: "/about" },
        { label: "Login", to: "/login" },
        { label: "Guest notice", to: "/guest" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Use", to: "/terms" },
        { label: "Privacy Policy", to: "/privacy" },
      ],
    },
  ];
  return (
    <footer className="border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-[2fr_3fr] gap-12">
        <div>
          <div className="flex items-center gap-1.5 font-display font-bold tracking-tight text-lg">
            <span className="inline-block size-2.5 rounded-full bg-foreground" />
            love4prompts
          </div>
          <p className="mt-4 text-sm text-foreground/60 max-w-xs">
            A living library of viral AI image trends, built for creators.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4">
                {c.title}
              </div>
              <ul className="space-y-2 text-sm">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="hover:underline text-foreground/75 hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 mt-12 flex items-center justify-between text-xs text-foreground/50">
        <span>© {new Date().getFullYear()} love4prompts</span>
        <span>Made for creators, not models.</span>
      </div>
    </footer>
  );
}

