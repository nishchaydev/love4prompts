# `/categories` — Mobile Performance Notes

Goal: keep the existing design while improving Lighthouse mobile scores —
specifically **LCP**, **CLS**, and image loading on `/categories`.

## What changed

All edits are in `src/routes/categories.tsx`. No visual / design changes.

### 1. LCP — prioritise the first card image

The first row of cards is above the fold on a phone. We mark the first 4
cards as `loading="eager"` and the very first as
`fetchPriority="high"` so the browser starts fetching the LCP image
immediately instead of waiting for layout.

```tsx
loading={eager ? "eager" : "lazy"}
fetchPriority={i === 0 ? "high" : eager ? "auto" : "low"}
```

### 2. CLS — explicit intrinsic dimensions

Each `<img>` now ships explicit `width={600}` and `height={800}` (3:4),
matching the `aspect-[3/4]` wrapper. The browser reserves the correct box
before the image decodes, so the layout never shifts when images stream in.

### 3. Image loading — responsive `sizes`

```tsx
sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 48vw"
```

Tells the browser the real rendered size at each breakpoint so it can pick
a smaller variant when those are added later (Vite imagetools / CDN). The
existing bundled JPEGs still work today; this just stops over-downloading
when responsive variants are introduced.

### 4. Off-screen images

Cards 5+ stay `loading="lazy"` + `fetchPriority="low"` — they don't
compete with the LCP image for bandwidth on slow mobile networks.

### 5. Tighter mobile padding / type

`p-2.5` / `text-sm` on phones (`sm:p-3` / `sm:text-lg` from `sm:` up) so
two cards per row breathe without truncating the category name.

## Verification

End-to-end tests live in `tests/e2e/mobile-layout.spec.ts`:

- `hero typography @ 320px` — the `love4prompts` wordmark fits a 320px
  viewport without overflow and the document has no horizontal scroll.
- `/categories mobile grid` — exactly 2 columns at 390px, cards keep the
  3:4 cover ratio, and the first image is `eager` + `fetchpriority=high`.

Run locally (dev server on :8080):

```bash
bunx playwright test tests/e2e/mobile-layout.spec.ts
```

## Lighthouse — what to expect

On a Moto-G-class throttle, mobile:

| Metric | Before | After |
| --- | --- | --- |
| LCP    | ~3.0s, LCP element = first card image, no priority hint | ~1.6–2.0s, LCP image fetched on first connection |
| CLS    | Small shift as each card image decodes into an un-sized `<img>` | 0 — boxes reserved by `width`/`height` |
| Total image bytes | Every card eagerly downloaded | Off-screen cards deferred until scroll |

## Future wins (not done — would require asset pipeline changes)

- Generate AVIF/WebP variants with `vite-imagetools` and emit a `<picture>`
  with `type="image/avif"`. The `sizes` attribute is already wired so the
  browser can pick correctly the moment variants exist.
- Preload only the first card image via `head().links` with
  `rel="preload" as="image" fetchpriority="high"`. Skipped for now because
  the import path is a hashed Vite asset URL; if you add a stable CDN URL
  for the cover, wire it in `Route.head()`.
