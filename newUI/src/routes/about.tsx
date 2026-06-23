import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Search, Sparkles, Upload } from "lucide-react";
import { SITE_URL } from "@/lib/trends";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — love4prompts" },
      {
        name: "description",
        content:
          "love4prompts is the fastest platform to discover, recreate, and use viral AI image trends in seconds.",
      },
      { property: "og:title", content: "Our Story — love4prompts" },
      {
        property: "og:description",
        content:
          "Outcome-first hub for trending AI image aesthetics. See the trend. Be the trend.",
      },
      { property: "og:url", content: `${SITE_URL}/about` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/about` }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const steps = [
    {
      n: "01",
      title: "Find trend",
      body: "Browse the latest viral layouts from TikTok, Instagram & Pinterest.",
      icon: Search,
    },
    {
      n: "02",
      title: "Launch model",
      body: "Click Create Image to automatically prepare the prompt for ChatGPT.",
      icon: Sparkles,
    },
    {
      n: "03",
      title: "Add photo",
      body: "Upload your own photo as a reference, generate, and become the trend.",
      icon: Upload,
    },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <span className="font-display font-bold text-base">Our story</span>
          <span className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <div className="text-xs uppercase tracking-[0.2em] text-foreground/55 mb-4">
          Our story
        </div>
        <h1 className="font-display font-black tracking-tight leading-[0.9] text-5xl md:text-7xl uppercase">
          See the <span className="italic font-light">trend.</span>
          <br />
          Be the <span className="italic font-light">trend.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-foreground/75">
          love4prompts is the fastest platform to discover, recreate, and use
          viral AI image trends in seconds.
        </p>

        {/* Not another prompt library */}
        <section className="mt-16 grid md:grid-cols-2 gap-10 border-t border-border pt-10">
          <h2 className="font-display font-black tracking-tight text-3xl md:text-4xl leading-tight">
            We are <span className="italic font-light">not</span> another prompt library.
          </h2>
          <div className="text-foreground/75 space-y-4">
            <p>
              We are not a catalog of random technical instructions, nor are we
              another prompt-base clone. We are the outcome-first hub for
              trending AI image aesthetics.
            </p>
            <p>
              Users come to love4prompts because they saw a viral image on
              Instagram, TikTok, Reels, Shorts, or Pinterest — and want to
              recreate it with their own face or custom characters.
            </p>
          </div>
        </section>

        {/* Problems we solve */}
        <section className="mt-20 border-t border-border pt-10">
          <div className="text-xs uppercase tracking-[0.2em] text-foreground/55 mb-4">
            The problems we solve
          </div>
          <h2 className="font-display font-black tracking-tight text-3xl md:text-4xl max-w-2xl">
            Scrolled past a viral image and wanted to make it? You know the
            frustration.
          </h2>
          <ul className="mt-8 grid md:grid-cols-3 gap-4">
            {[
              "Endless comment loops (“DM me prompt”).",
              "Searching creator profiles for hidden links.",
              "Hours reverse-engineering complex formulas.",
            ].map((p) => (
              <li
                key={p}
                className="rounded-2xl border border-border bg-card p-5 text-foreground/80"
              >
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-foreground/75">
            We remove all of this friction by giving you the <strong>trend</strong>,
            the <strong>prompt</strong>, and a <strong>one-click launch</strong>{" "}
            directly into the AI model.
          </p>
        </section>

        {/* 3 steps */}
        <section className="mt-20 border-t border-border pt-10">
          <div className="text-xs uppercase tracking-[0.2em] text-foreground/55 mb-6">
            Recreate trends in 3 steps
          </div>
          <div className="grid md:grid-cols-3 gap-8 md:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="border-t border-foreground pt-6">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-sm font-medium">{s.n}</span>
                  <s.icon className="size-5 text-foreground/60" />
                </div>
                <h3 className="font-display font-black tracking-tight text-3xl md:text-4xl leading-[0.95] mb-3">
                  {s.title}
                </h3>
                <p className="text-foreground/70">{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20">
          <div className="rounded-[2rem] bg-foreground text-background p-10 md:p-14 text-center">
            <h2 className="font-display font-black tracking-tight text-3xl md:text-5xl uppercase">
              Ready to <span className="italic font-light">be</span> the trend?
            </h2>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/trends"
                className="inline-flex items-center gap-1.5 rounded-full bg-background text-foreground px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
              >
                Browse trends <ArrowUpRight className="size-4" />
              </Link>
              <Link
                to="/submit"
                className="inline-flex items-center gap-1.5 rounded-full border border-background/30 text-background px-5 py-3 text-sm font-semibold hover:bg-background/10 transition"
              >
                Submit a trend
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
