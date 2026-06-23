import { useState } from "react";
import {
  createFileRoute,
  Link,
  notFound,
  useRouter,
} from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  Copy,
  Facebook,
  Flame,
  Link as LinkIcon,
  Lock,
  MessageCircle,
  Share2,
  Sparkles,
  Twitter,
} from "lucide-react";
import { toast } from "sonner";

import {
  chatGptUrlFor,
  createUrlFor,
  getRelatedTrends,
  getTrendBySlug,
  SITE_URL,
  trendUrlFor,
  type Trend,
} from "@/lib/trends";

export const Route = createFileRoute("/trend/$slug")({
  loader: ({ params }) => {
    const trend = getTrendBySlug(params.slug);
    if (!trend) throw notFound();
    return { trend };
  },
  head: ({ params, loaderData }) => {
    const trend = loaderData?.trend;
    const url = trendUrlFor(params.slug);
    if (!trend) {
      return {
        meta: [
          { title: "Trend not found — love4prompts" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const title = `${trend.title} — love4prompts`;
    const description = `${trend.title}: a viral AI image trend in ${trend.category}. Tap to launch the generator with the reference preloaded.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:image", content: `${SITE_URL}${trend.img}` },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: trend.title,
            articleSection: trend.category,
            image: trend.img,
            url,
          }),
        },
      ],
    };
  },
  component: TrendPage,
  notFoundComponent: TrendNotFound,
  errorComponent: TrendError,
});

function TrendPage() {
  const { trend } = Route.useLoaderData();
  const related = getRelatedTrends(trend.slug, 4);
  const [revealed, setRevealed] = useState(false);

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(trend.prompt);
      toast.success("Prompt copied");
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Sticky top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 md:px-6 h-14 flex items-center justify-between">
          <BackButton />
          <Link
            to="/"
            className="flex items-center gap-1.5 font-display font-bold tracking-tight text-sm"
          >
            <span className="inline-block size-2 rounded-full bg-foreground" />
            love4prompts
          </Link>
          <div className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 md:px-6 pt-6 pb-24">
        {/* Hero image with pink offset shadow */}
        <div className="relative inline-block w-full max-w-md mx-auto md:mx-0 md:max-w-sm">
          <div
            aria-hidden
            className="absolute inset-0 translate-x-2 translate-y-2 rounded-[2rem] bg-[#FF6B8A]"
          />
          <div className="relative rounded-[2rem] overflow-hidden border border-foreground/10 bg-muted">
            <img
              src={trend.img}
              alt={trend.title}
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          {/* Pills */}
          <div className="flex items-center gap-2 flex-wrap mb-4">
            <span className="inline-flex items-center rounded-full bg-[#FF6B8A]/10 text-[#FF3D71] border border-[#FF6B8A]/40 px-3 py-1 text-xs font-bold uppercase tracking-wider">
              {trend.category}
            </span>
            {trend.hot && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                <Flame className="size-3" /> Hot
              </span>
            )}
          </div>

          <h1 className="font-display font-black tracking-tight leading-[0.95] text-4xl sm:text-5xl md:text-6xl uppercase">
            {trend.title}
          </h1>

          <p className="mt-5 max-w-prose text-foreground/65 text-base md:text-lg">
            Tap the button below to launch this trend in your AI generator. The
            reference is preloaded — just hit create.
          </p>

          {/* Primary CTA */}
          <div className="mt-8 space-y-3">
            <a
              href={createUrlFor(trend.slug)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 w-full rounded-full bg-[#FF6B8A] text-white px-6 py-5 text-base font-bold uppercase tracking-wider shadow-[0_8px_0_0_#0a0a0a] hover:shadow-[0_4px_0_0_#0a0a0a] hover:translate-y-1 transition-all"
            >
              <Sparkles className="size-5" />
              Create image
              <ArrowUpRight className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            {/* Reveal prompt toggle */}
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              aria-expanded={revealed}
              aria-controls="prompt-panel"
              className="flex items-center justify-center gap-2 w-full rounded-full border border-border bg-background px-6 py-3.5 text-sm font-semibold hover:bg-muted transition"
            >
              <Lock className="size-4" />
              {revealed ? "Hide prompt" : "Reveal prompt"}
            </button>

            <AnimatePresence initial={false}>
              {revealed && (
                <motion.div
                  id="prompt-panel"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 rounded-2xl border border-border bg-muted/40 p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/55 mb-2">
                      Prompt
                    </div>
                    <pre className="whitespace-pre-wrap break-words font-mono text-sm text-foreground/85">
                      {trend.prompt}
                    </pre>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <a
                        href={chatGptUrlFor(trend.prompt)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => toast.success("Opening in ChatGPT")}
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-3 text-sm font-semibold hover:opacity-90 transition"
                      >
                        <MessageCircle className="size-4" />
                        Open in ChatGPT
                        <ArrowUpRight className="size-4" />
                      </a>
                      <button
                        type="button"
                        onClick={copyPrompt}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-muted transition"
                      >
                        <Copy className="size-4" />
                        Copy prompt
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Social share */}
          <ShareRow trend={trend} />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-20">
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="font-display font-black tracking-tight text-2xl md:text-3xl">
                You might also like
              </h2>
              <Link
                to="/"
                hash="trends"
                className="text-sm border-b border-foreground pb-0.5 hover:opacity-70"
              >
                See all
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {related.map((t) => (
                <RelatedCard key={t.slug} trend={t} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) router.history.back();
        else router.navigate({ to: "/" });
      }}
      aria-label="Go back"
      className="inline-flex items-center justify-center size-10 rounded-full border border-border hover:bg-muted transition"
    >
      <ArrowLeft className="size-5" />
    </button>
  );
}

function RelatedCard({ trend }: { trend: Trend }) {
  return (
    <Link
      to="/trend/$slug"
      params={{ slug: trend.slug }}
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-border bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground"
    >
      <img
        src={trend.img}
        alt={trend.title}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-3">
        <div className="text-[9px] uppercase tracking-widest text-white/80">
          {trend.category}
        </div>
        <div className="font-display font-bold text-white text-sm leading-tight">
          {trend.title}
        </div>
      </div>
    </Link>
  );
}

function ShareRow({ trend }: { trend: Trend }) {
  const url = trendUrlFor(trend.slug);
  const text = `${trend.title} — viral AI image trend`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  const nativeShare = async () => {
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await (navigator as any).share({ title: trend.title, text, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  };

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  const btn =
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-background px-3.5 py-2 text-xs font-semibold hover:bg-muted transition";

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center gap-2 mb-3 text-[11px] uppercase tracking-[0.18em] text-foreground/55">
        <Share2 className="size-3.5" /> Share this trend
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={nativeShare} className={btn}>
          <Share2 className="size-3.5" /> Share
        </button>
        <a href={twitter} target="_blank" rel="noopener noreferrer" className={btn}>
          <Twitter className="size-3.5" /> Twitter
        </a>
        <a href={facebook} target="_blank" rel="noopener noreferrer" className={btn}>
          <Facebook className="size-3.5" /> Facebook
        </a>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={btn}>
          <MessageCircle className="size-3.5" /> WhatsApp
        </a>
        <button type="button" onClick={copyLink} className={btn}>
          <LinkIcon className="size-3.5" /> Copy link
        </button>
      </div>
    </div>
  );
}

function TrendNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-xs uppercase tracking-[0.2em] text-foreground/50 mb-4">
          404
        </div>
        <h1 className="font-display font-black tracking-tight text-4xl md:text-5xl mb-4">
          Trend not found
        </h1>
        <p className="text-foreground/65 mb-8">
          That trend doesn't exist (yet). Browse the live feed for what's
          trending right now.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          <ArrowLeft className="size-4" />
          Back to trends
        </Link>
      </div>
    </div>
  );
}

function TrendError({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="font-display font-black tracking-tight text-3xl mb-3">
          Something went wrong
        </h1>
        <p className="text-foreground/65 mb-6 text-sm">{error.message}</p>
        <button
          type="button"
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
