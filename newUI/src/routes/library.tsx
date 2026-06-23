import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Flame } from "lucide-react";
import { SITE_URL, TRENDS } from "@/lib/trends";
import { useRequireAuth } from "@/lib/useRequireAuth";

export const Route = createFileRoute("/library")({
  head: () => ({
    meta: [
      { title: "Image library — love4prompts" },
      {
        name: "description",
        content:
          "Every viral AI image trend reference in one place. Tap any image to open its dedicated trend page.",
      },
      { property: "og:title", content: "Image library — love4prompts" },
      {
        property: "og:description",
        content: "Every viral AI image trend reference in one place.",
      },
      { property: "og:url", content: `${SITE_URL}/library` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/library` }],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const authed = useRequireAuth();
  if (!authed) return null;
  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <span className="font-display font-bold text-base">Image library</span>
          <span className="text-xs text-foreground/60">{TRENDS.length} images</span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pt-10 pb-20">
        <h1 className="font-display font-black tracking-tight text-4xl md:text-5xl uppercase">
          Every image
        </h1>
        <p className="mt-3 text-foreground/70 max-w-2xl">
          The full visual archive. Tap an image to open the trend.
        </p>

        <div className="mt-8 columns-2 md:columns-3 lg:columns-4 gap-3 [column-fill:_balance]">
          {TRENDS.map((t) => (
            <Link
              key={t.slug}
              to="/trend/$slug"
              params={{ slug: t.slug }}
              className="group relative mb-3 inline-block w-full break-inside-avoid rounded-2xl overflow-hidden border border-border bg-card focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
            >
              <img
                src={t.img}
                alt={t.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500"
              />
              {t.hot && (
                <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  <Flame className="size-3" /> Hot
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <div className="text-[9px] uppercase tracking-widest text-white/80">{t.category}</div>
                <div className="font-display font-bold text-white text-sm leading-tight">{t.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
