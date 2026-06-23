import { createFileRoute, Link } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/trends";
import { LegalShell, Section } from "./terms";

export const Route = createFileRoute("/guest")({
  head: () => ({
    meta: [
      { title: "Non-User Notice — love4prompts" },
      {
        name: "description",
        content:
          "What guests should know about using love4prompts without an account.",
      },
      { property: "og:title", content: "Non-User Notice — love4prompts" },
      {
        property: "og:description",
        content:
          "Browsing love4prompts as a guest — content, data, and account benefits.",
      },
      { property: "og:url", content: `${SITE_URL}/guest` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/guest` }],
  }),
  component: GuestPage,
});

function GuestPage() {
  return (
    <LegalShell title="Non-User Notice" updated="June 2026">
      <Section n="1" title="Browsing as a guest">
        <p>
          You are currently browsing love4prompts as an unregistered user.
          While you are free to explore our prompt library and use some of our
          basic tools, creating an account unlocks the full potential of our
          platform — including saving prompts, managing your library, and
          accessing advanced features.
        </p>
        <div className="mt-5">
          <Link
            to="/login"
            className="inline-flex items-center rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition"
          >
            Create an account
          </Link>
        </div>
      </Section>

      <Section n="2" title="User-content disclaimer">
        <p>
          We do not take any guarantee of the content uploaded, submitted, or
          shared by users on our platform. The prompts and text you see are
          generated or shared by the community and are not endorsed by us.
          Please use your own discretion when interacting with or utilizing any
          user-generated content.
        </p>
      </Section>

      <Section n="3" title="Data collection">
        <p>
          Even as a non-registered user, we may collect basic analytics and
          usage data to help us improve the site. For full details on what we
          collect and how it is used, please refer to our{" "}
          <Link to="/privacy" className="underline">Privacy Policy</Link>.
        </p>
      </Section>
    </LegalShell>
  );
}
