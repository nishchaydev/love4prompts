import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Flame } from "lucide-react";
import { CATEGORIES, SITE_URL, TRENDS, type Trend } from "@/lib/trends";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — love4prompts" },
      {
        name: "description",
        content:
          "Browse all viral AI image trend categories — Boys, Girls, Professional, AI Art, Birthday, Festivals, Posters, Netflix Typography and more.",
      },
      { property: "og:title", content: "Categories — love4prompts" },
      {
        property: "og:description",
        content: "Browse every viral AI image trend category.",
      },
      { property: "og:url", content: `${SITE_URL}/categories` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/categories` }],
  }),
  component: CategoriesPage,
});

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-background";

type CategoryCard = {
  name: string;
  count: number;
  hot: number;
  cover?: Trend;
};

function CategoriesPage() {
  const cards: CategoryCard[] = CATEGORIES.map((name) => {
    const trends = TRENDS.filter((t) => t.category === name);
    return {
      name,
      count: trends.length,
      hot: trends.filter((t) => t.hot).length,
      cover: trends.find((t) => t.hot) ?? trends[0],
    };
  });

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      {/* Same sticky header as the Trend library page */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
          <Link
            to="/"
            className={`inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition min-h-11 ${focusRing}`}
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Back
          </Link>
          <span className="font-display font-bold text-base text-center truncate">
            Categories
          </span>
          <span className="text-xs text-foreground/60 justify-self-end">
            {CATEGORIES.length}
          </span>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 sm:pt-10 pb-4">
          <h1 className="font-display font-black tracking-tight text-3xl sm:text-4xl md:text-5xl uppercase">
            Trending now
          </h1>
          <p className="mt-3 text-foreground/70 max-w-2xl text-sm sm:text-base">
            Pick a vibe. Open any category to see every trend inside.
          </p>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {cards.map((c, i) => {
              const eager = i < 4;
              return (
              <li key={c.name} data-testid="category-card">
                <Link
                  to="/trends"
                  search={{ category: c.name }}
                  aria-label={`${c.name} — ${c.count} ${c.count === 1 ? "trend" : "trends"}`}
                  className={`group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] transition ${focusRing}`}
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                    {c.cover?.img ? (
                      <img
                        src={c.cover.img}
                        alt={c.name}
                        width={600}
                        height={800}
                        loading={eager ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={i === 0 ? "high" : eager ? "auto" : "low"}
                        sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
                        className="absolute inset-0 size-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                    {c.hot > 0 && (
                      <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                        <Flame className="size-3" aria-hidden="true" /> Hot
                      </span>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3">
                      <p className="text-[10px] uppercase tracking-widest text-white/80">
                        Category
                      </p>
                      <h2 className="font-display font-bold text-white text-sm sm:text-lg leading-tight truncate">
                        {c.name}
                      </h2>
                    </div>
                  </div>
                  <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                    <span className="text-[11px] sm:text-xs text-foreground/70 min-w-0 truncate">
                      {c.count} {c.count === 1 ? "trend" : "trends"}
                    </span>
                    <ArrowUpRight
                      className="size-4 shrink-0 text-foreground/50 group-hover:text-foreground transition"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              </li>
              );
            })}
          </ul>
        </section>
      </main>
    </div>
  );
}
