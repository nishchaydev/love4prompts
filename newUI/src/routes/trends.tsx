import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Flame, Search, X } from "lucide-react";

import { CATEGORIES, SITE_URL, TRENDS, type Trend } from "@/lib/trends";

export const Route = createFileRoute("/trends")({
  validateSearch: (s: Record<string, unknown>) => ({
    category: typeof s.category === "string" ? s.category : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Trend library — love4prompts" },
      {
        name: "description",
        content:
          "Browse the full library of viral AI image trends. Search prompts, filter by category, and open any trend to recreate it.",
      },
      { property: "og:title", content: "Trend library — love4prompts" },
      {
        property: "og:description",
        content:
          "Browse the full library of viral AI image trends. Search prompts, filter by category, and open any trend to recreate it.",
      },
      { property: "og:url", content: `${SITE_URL}/trends` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/trends` }],
  }),
  component: TrendsLibrary,
});

const PAGE_SIZE = 12;
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function TrendsLibrary() {
  const search = Route.useSearch();
  const initialCategory = search.category && (CATEGORIES.includes(search.category) || search.category === "All") ? search.category : "All";
  const [category, setCategory] = useState<string>(initialCategory);
  const [hotOnly, setHotOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (search.category && (CATEGORIES.includes(search.category) || search.category === "All")) {
      setCategory(search.category);
    }
  }, [search.category]);

  const filterCategories = ["All", ...CATEGORIES];

  const filtered: Trend[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TRENDS.filter((t) => category === "All" || t.category === category)
      .filter((t) => !hotOnly || t.hot)
      .filter((t) => {
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.slug.toLowerCase().includes(q) ||
          t.prompt.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => Number(!!b.hot) - Number(!!a.hot));
  }, [category, hotOnly, query]);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [category, hotOnly, query]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Infinite scroll
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length));
        }
      },
      { rootMargin: "400px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, filtered.length]);

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition min-h-11 ${focusRing}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Link>
          <span className="font-display font-bold text-base">Trend library</span>
          <span className="text-xs text-foreground/60" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "trend" : "trends"}
          </span>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pt-10 pb-6">
          <h1 className="font-display font-black tracking-tight text-4xl md:text-5xl uppercase">
            The full trend library
          </h1>
          <p className="mt-3 text-foreground/70 max-w-2xl">
            Every viral AI image trend in one place. Search, filter, and tap any card to open its dedicated page.
          </p>

          {/* Search */}
          <div className="mt-6 relative max-w-xl">
            <label htmlFor="trend-search" className="sr-only">
              Search trends and prompts
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/50"
              aria-hidden="true"
            />
            <input
              id="trend-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, category, or prompt…"
              className={`w-full rounded-full border border-border bg-background pl-11 pr-11 py-3 text-sm placeholder:text-muted-foreground min-h-11 ${focusRing}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center size-9 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition ${focusRing}`}
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div
            className="mt-4 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter trends"
          >
            <button
              type="button"
              onClick={() => setHotOnly((v) => !v)}
              aria-pressed={hotOnly}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium border transition min-h-9 ${focusRing} ${
                hotOnly
                  ? "bg-orange-500 text-white border-orange-500"
                  : "bg-background text-foreground/70 border-border hover:bg-muted"
              }`}
            >
              <Flame className="size-3.5" aria-hidden="true" /> Hot first
            </button>
            {filterCategories.map((c) => {
              const active = category === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-1.5 text-sm transition min-h-9 ${focusRing} ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground/70 border-border hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-20">
          {filtered.length === 0 ? (
            <p className="text-foreground/70 py-12 text-center">
              No trends match{query ? ` “${query}”` : " this filter"}. Try a different keyword or category.
            </p>
          ) : (
            <>
              <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {visible.map((t) => (
                  <li key={t.slug}>
                    <Link
                      to="/trend/$slug"
                      params={{ slug: t.slug }}
                      className={`group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] transition ${focusRing}`}
                    >
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <LazyImage
                          src={t.img}
                          alt={t.title}
                          className="absolute inset-0 size-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        />
                        {t.hot && (
                          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                            <Flame className="size-3" aria-hidden="true" /> Hot
                          </span>
                        )}
                      </div>
                      <div className="p-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-widest text-foreground/60">
                            {t.category}
                          </p>
                          <h3 className="font-display font-bold text-sm leading-tight truncate">
                            {t.title}
                          </h3>
                        </div>
                        <ArrowUpRight
                          className="size-4 text-foreground/50 group-hover:text-foreground transition"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              {hasMore && (
                <>
                  <div ref={sentinelRef} aria-hidden="true" className="h-1" />
                  <div className="mt-8 flex justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((c) => Math.min(c + PAGE_SIZE, filtered.length))
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-5 py-3 text-sm font-medium hover:bg-muted transition min-h-11 ${focusRing}`}
                    >
                      Load more
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

function LazyImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/60" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`${className ?? ""} transition-opacity duration-500`}
        style={{ opacity: loaded ? 1 : 0 }}
      />
    </>
  );
}
