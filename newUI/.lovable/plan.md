## Goal
1. **Hot toggle** that composes with category filtering (not exclusive).
2. **Dedicated `/trend/$slug` pages** so mobile users get a real, shareable page per trend.
3. **CTA audit** — every "Create image →" opens `https://meigen.ai/create?trend=<slug>` in a new tab with the correct slug.
4. **Shared `src/lib/trends.ts`** as single source of truth.
5. **"Reveal prompt"** action with ChatGPT deep-link.
6. **Canonical base URL** = `https://love4prompts-five.vercel.app` (not the lovable.app preview).

## Files

### NEW — `src/lib/trends.ts`
- `export const SITE_URL = "https://love4prompts-five.vercel.app"` — single source of truth for canonical/og:url across the site.
- `export type Trend = { slug; title; category; img; height; hot?; prompt: string }` — adds a `prompt` string for ChatGPT injection.
- `export const TRENDS: Trend[]` — 10 existing entries + per-trend `prompt` strings matching each visual.
- `export const CATEGORIES: string[]`.
- `export const CREATE_BASE = "https://meigen.ai/create"`.
- `export const createUrlFor = (slug) => \`${CREATE_BASE}?trend=${encodeURIComponent(slug)}\``.
- `export const chatGptUrlFor = (prompt) => \`https://chat.openai.com/?q=${encodeURIComponent(prompt)}\`` — ChatGPT's `?q=` URL injection (preloads prompt into a new chat).
- `export const trendUrlFor = (slug) => \`${SITE_URL}/trend/${slug}\`` — used in canonical + og:url.
- `getTrendBySlug(slug)`, `getRelatedTrends(slug, count = 4)` (same-category first, then hot, then rest).

### NEW — `src/routes/trend.$slug.tsx`
Dedicated full page per trend (mobile-first; references image-27, image-28):
- `createFileRoute("/trend/$slug")`, `loader` resolves via `getTrendBySlug`; throws `notFound()` if missing.
- `head({ params, loaderData })`:
  - `title`, `description`, `og:title`, `og:description`, `og:type: "article"`, `og:image` (trend image absolute URL using `SITE_URL`), `og:url` → `trendUrlFor(slug)`.
  - `links: [{ rel: "canonical", href: trendUrlFor(slug) }]`.
  - `scripts`: JSON-LD `Article` schema with headline + image.
- `notFoundComponent` + `errorComponent` (retry: `router.invalidate()` + `reset()`).
- Layout:
  - Sticky top bar with back arrow (`router.history.back()` fallback `/`).
  - Hero image (rounded with pink offset shadow).
  - Title (big bold) + `CATEGORY` / `HOT` pills.
  - Short copy: "Tap the button below to launch this trend in your AI generator. The reference is preloaded — just hit create."
  - **Primary CTA "CREATE IMAGE"** (full-width pink) → `createUrlFor(slug)`, `target="_blank" rel="noopener noreferrer"`.
  - **Secondary "🔓 Reveal prompt"** outline pill below CTA:
    - Click → expands inline panel with prompt in mono block + two actions:
      - **"Open in ChatGPT →"** → `chatGptUrlFor(trend.prompt)`, new tab.
      - **"Copy prompt"** → `navigator.clipboard.writeText`, sonner toast.
    - Framer-motion height animation; instant fallback on `prefers-reduced-motion`.
  - **"You might also like"** grid (3–4 from `getRelatedTrends`), each `<Link to="/trend/$slug" params={{ slug }}>`.

### EDIT — `src/routes/index.tsx`
- Import `TRENDS`, `CATEGORIES`, `Trend`, `createUrlFor`, `SITE_URL` from `@/lib/trends`; delete local copies.
- Update root `head()`:
  - `og:url` → `SITE_URL`.
  - Add `links: [{ rel: "canonical", href: SITE_URL + "/" }]`.
- **Hot toggle**:
  - `const [showHotOnly, setShowHotOnly] = useState(false)`.
  - `🔥 Hot` pill inline with category chips, `aria-pressed` reflects state.
  - Pipeline:
    ```
    visible = TRENDS
      .filter(t => activeCategory === "All" || t.category === activeCategory)
      .filter(t => !showHotOnly || t.hot)
      .sort((a, b) => Number(b.hot ?? false) - Number(a.hot ?? false))
    ```
- **Mobile-aware card click**:
  - `openTrend(trend)` — if `window.matchMedia("(min-width: 768px)").matches` → open `TrendLightbox`; else `navigate({ to: "/trend/$slug", params: { slug: trend.slug } })`.
  - Wired into `TrendCard` and `StackedWindowCards` deck clicks.
  - Cards wrapped with `<Link>` overlay (calls `openTrend` + `e.preventDefault()` on desktop; lets the link navigate on mobile) so right-click / long-press / `Cmd+click` work.
- **`TrendLightbox`**:
  - `Create image →` anchor uses `createUrlFor` + `target="_blank" rel="noopener noreferrer"`.
  - Add secondary **"Open full page →"** internal `<Link>` to `/trend/$slug`.
- **CTA audit**: `rg "meigen.ai" src` returns only the constant in `src/lib/trends.ts`.

## Out of scope
- No backend; trends remain a static array.
- No nav, footer, deck-settings, masonry, or scroll-reveal changes.
- ChatGPT injection uses the public `chat.openai.com/?q=<prompt>` URL — no API key.
- Sitemap/robots updates for the new routes — follow-up if requested.

## Verification
- [ ] `rg "meigen.ai" src` → only `src/lib/trends.ts`.
- [ ] All 10 slugs render `/trend/<slug>` with correct title, image, CTA, prompt.
- [ ] `/trend/xyz` → `notFoundComponent`.
- [ ] Canonical + og:url on `/trend/<slug>` resolve to `https://love4prompts-five.vercel.app/trend/<slug>`; home canonical resolves to `https://love4prompts-five.vercel.app/`.
- [ ] Hot toggle + category compose; hot items float first when toggle off.
- [ ] Mobile (`< 768px`): tap card → `/trend/$slug`. Desktop: lightbox; lightbox "Open full page →" → same route.
- [ ] "Reveal prompt" expands, "Open in ChatGPT" opens new tab with prompt pre-filled, "Copy prompt" copies.
- [ ] All external CTAs use `target="_blank" rel="noopener noreferrer"`.