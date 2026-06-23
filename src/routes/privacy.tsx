import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/trends";
import { LegalShell, Section } from "./terms";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — love4prompts" },
      {
        name: "description",
        content:
          "How love4prompts collects, uses, and protects your data, including third-party services and your rights.",
      },
      { property: "og:title", content: "Privacy Policy — love4prompts" },
      {
        property: "og:description",
        content: "Privacy practices for love4prompts.",
      },
      { property: "og:url", content: `${SITE_URL}/privacy` },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/privacy` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="June 2026">
      <Section n="1" title="What we collect">
        <p>We collect minimal information to provide and improve our service. This includes:</p>
        <ul className="space-y-3 mt-3">
          <li><strong>Email address:</strong> only if you explicitly subscribe to our newsletter. This is securely stored using Supabase.</li>
          <li><strong>Usage data:</strong> collected via Microsoft Clarity. This records heatmaps, session clicks, and general interaction patterns in an anonymized form to help us optimize the toolkit.</li>
          <li><strong>Prompts:</strong> the text you input is processed in real time by Groq AI to generate optimized prompt suggestions. We do not store or retain your prompt text on our servers.</li>
        </ul>
      </Section>

      <Section n="2" title="How we use it">
        <ul className="list-disc pl-6 space-y-2">
          <li>To send weekly prompt ideas, templates, and updates directly to your inbox (only if subscribed). You can opt out at any time.</li>
          <li>To analyze general usage patterns and fix bugs.</li>
          <li>We never sell, rent, or share your personal data with third-party advertisers or brokers.</li>
        </ul>
      </Section>

      <Section n="3" title="Third-party services">
        <p>
          We use or may use third-party services to operate our website, serve
          ads, and provide AI functionality. These third parties may collect,
          process, or store data according to their own privacy policies:
        </p>
        <ul className="space-y-2 mt-3">
          <li><strong>Database:</strong> <a className="underline" href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase</a></li>
          <li><strong>Analytics:</strong> <a className="underline" href="https://privacy.microsoft.com" target="_blank" rel="noopener noreferrer">Microsoft Clarity</a></li>
          <li><strong>AI inference:</strong> <a className="underline" href="https://groq.com/privacy" target="_blank" rel="noopener noreferrer">Groq</a></li>
          <li><strong>Hosting:</strong> <a className="underline" href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel</a></li>
          <li><strong>Advertising:</strong> Google AdSense uses cookies to serve ads based on your prior visits. <a className="underline" href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">Learn more</a>.</li>
        </ul>
      </Section>

      <Section n="4" title="Your rights">
        <p>You have complete control over your data:</p>
        <ul className="list-disc pl-6 mt-3 space-y-2">
          <li>To request immediate deletion of your email from our database, contact us at <a className="underline" href="mailto:nishchaydev@outlook.com">nishchaydev@outlook.com</a>.</li>
          <li>To delete your cached prompt history and preferences, simply clear your browser's site data or local storage.</li>
        </ul>
      </Section>
    </LegalShell>
  );
}
