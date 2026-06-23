import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import { CATEGORIES, SITE_URL } from "@/lib/trends";
import { useRequireAuth } from "@/lib/useRequireAuth";

export const Route = createFileRoute("/submit")({
  head: () => ({
    meta: [
      { title: "Submit a trend — love4prompts" },
      {
        name: "description",
        content:
          "Spotted a viral AI image trend? Submit it and we'll add it to the live feed.",
      },
      { property: "og:title", content: "Submit a trend — love4prompts" },
      {
        property: "og:description",
        content: "Share a viral AI image trend with the community.",
      },
      { property: "og:url", content: `${SITE_URL}/submit` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/submit` }],
  }),
  component: SubmitPage,
});

function SubmitPage() {
  const authed = useRequireAuth();
  const [submitting, setSubmitting] = useState(false);
  if (!authed) return null;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Trend submitted — thanks! We'll review it soon.");
    }, 600);
  };

  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition"
          >
            <ArrowLeft className="size-4" /> Back
          </Link>
          <span className="font-display font-bold text-base">Submit a trend</span>
          <span className="w-10" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 pt-10 pb-24">
        <h1 className="font-display font-black tracking-tight text-4xl md:text-5xl uppercase">
          Spotted a trend?
        </h1>
        <p className="mt-3 text-foreground/70">
          Drop the details below. Featured submissions get credit + a shoutout.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Field label="Trend title" name="title" placeholder="e.g. Cinematic Golden Hour Portrait" required />
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <Field label="Reference image URL" name="image" type="url" placeholder="https://…" required />
          <div>
            <label className="block text-sm font-medium mb-2">Prompt</label>
            <textarea
              name="prompt"
              required
              rows={5}
              placeholder="The exact prompt or a description of the style…"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm"
            />
          </div>
          <Field label="Your handle (optional)" name="handle" placeholder="@yourname" />
          <Field label="Email (for credit)" name="email" type="email" placeholder="you@email.com" />

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-6 py-4 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition disabled:opacity-50"
          >
            <Send className="size-4" />
            {submitting ? "Submitting…" : "Submit trend"}
          </button>
        </form>
      </main>
    </div>
  );
}

function Field({
  label, name, type = "text", placeholder, required,
}: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium mb-2">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground"
      />
    </div>
  );
}
