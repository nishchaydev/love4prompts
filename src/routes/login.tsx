import { useState } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { ArrowLeft, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { SITE_URL } from "@/lib/trends";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Login — love4prompts" },
      {
        name: "description",
        content: "Sign in to save trends, submit your own, and track your favorites.",
      },
      { property: "og:title", content: "Login — love4prompts" },
      { property: "og:url", content: `${SITE_URL}/login` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/login` }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: "/login" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signIn();
    toast.success(mode === "signin" ? "Signed in" : "Account created");
    const target = redirect && redirect.startsWith("/") ? redirect : "/";
    navigate({ to: target });
  };


  return (
    <div className="min-h-dvh bg-background text-foreground font-sans antialiased flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 hover:text-foreground transition">
            <ArrowLeft className="size-4" /> Back
          </Link>
          <Link to="/" className="flex items-center gap-1.5 font-display font-bold tracking-tight text-base">
            <span className="inline-block size-2 rounded-full bg-foreground" />
            love4prompts
          </Link>
          <span className="w-10" />
        </div>
      </header>

      <main className="flex-1 grid place-items-center px-6 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display font-black tracking-tight text-3xl md:text-4xl uppercase text-center">
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h1>
          <p className="mt-2 text-center text-sm text-foreground/65">
            {mode === "signin" ? "Sign in to continue." : "Join the trend feed."}
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/50" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-4 text-foreground/50" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                minLength={6}
                className="w-full rounded-full border border-border bg-background pl-11 pr-4 py-3 text-sm placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-full bg-foreground text-background px-6 py-3.5 text-sm font-bold uppercase tracking-wider hover:opacity-90 transition"
            >
              {mode === "signin" ? "Sign in" : "Create account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-foreground/65">
            {mode === "signin" ? (
              <>
                New here?{" "}
                <button type="button" onClick={() => setMode("signup")} className="font-semibold underline hover:no-underline">
                  Create an account
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button type="button" onClick={() => setMode("signin")} className="font-semibold underline hover:no-underline">
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
