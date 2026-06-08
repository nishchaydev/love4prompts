# Refactor AI Prompt Toolkit

Decompose the monolithic `UniversalBar.tsx` React component, eliminate duplication in the Astro landing pages using a shared layout component, and harden the JSON output parsing in the Bulletproof API.

## Project Type
WEB

## Success Criteria
- Monolithic React component split into 5 modular, single-responsibility files inside `src/components/hero/UniversalBar/`.
- Three duplicate Astro generator pages refactored to use a new `ToolPage.astro` layout, reducing page file size by 75%.
- `bulletproof.ts` API refactored to use standard system prompt schemas and robust JSON output handling.
- Astro project builds successfully with `pnpm run build` with zero TypeScript compiler errors.
- Lighthouse performance index remains optimal with zero layout shifts on mobile.

## Tech Stack
- Astro (SSG framework)
- React (Interactive client hydration)
- Tailwind CSS (Theme tokens and layouts)
- Groq / Gemini API

## File Structure
```
src/
  ├── components/
  │    ├── hero/
  │    │    ├── UniversalBar/
  │    │    │    ├── index.tsx          (Main container orchestrating state and logic)
  │    │    │    ├── types.ts           (Type declarations)
  │    │    │    ├── logos.tsx          (SVG brand logo elements)
  │    │    │    ├── RecentChips.tsx    (localStorage history prompt chips)
  │    │    │    ├── BulletproofMode.tsx(Interactive Q&A grid and merged display)
  │    │    │    └── UniversalBar.css   (Optional component-specific scoping if needed)
  │    ├── layout/
  │    │    └── ToolPage.astro          (Shared layout component for SEO pages)
  ├── pages/
  │    ├── api/
  │    │    └── tools/
  │    │         └── bulletproof.ts     (Enhanced JSON schema API handler)
  │    ├── coding-prompt-generator.astro(Refactored)
  │    ├── instagram-caption-generator.astro(Refactored)
  │    └── linkedin-post-generator.astro(Refactored)
```

## Task Breakdown

### Task 1: Create Types and Logo assets
- **Task ID**: `TASK_TYPES_LOGOS`
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`
- **Priority**: P0
- **Dependencies**: None
- **INPUT**: [UniversalBar.tsx](file:///n:/PROGRAMS/GIT%20and%20GITHUB/New%20folder/src/components/hero/UniversalBar.tsx) type interfaces and SVG component declarations.
- **OUTPUT**:
  - `src/components/hero/UniversalBar/types.ts` containing the TS definitions.
  - `src/components/hero/UniversalBar/logos.tsx` containing the SVG logo renders.
- **VERIFY**: Run `npx tsc --noEmit` to ensure zero compilation or export/import syntax errors.

### Task 2: Create Sub-Components (RecentChips and BulletproofMode)
- **Task ID**: `TASK_SUBCOMPONENTS`
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `react-patterns`
- **Priority**: P1
- **Dependencies**: `TASK_TYPES_LOGOS`
- **INPUT**: Code for history chips rendering and bulletproof logic in [UniversalBar.tsx](file:///n:/PROGRAMS/GIT%20and%20GITHUB/New%20folder/src/components/hero/UniversalBar.tsx).
- **OUTPUT**:
  - `src/components/hero/UniversalBar/RecentChips.tsx`
  - `src/components/hero/UniversalBar/BulletproofMode.tsx`
- **VERIFY**: Check that imports from `types.ts` and `logos.tsx` are correctly configured. Run `npx tsc --noEmit`.

### Task 3: Refactor index.tsx (Main UniversalBar Component)
- **Task ID**: `TASK_MAIN_REFACTOR`
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `react-patterns`
- **Priority**: P1
- **Dependencies**: `TASK_SUBCOMPONENTS`
- **INPUT**: [UniversalBar.tsx](file:///n:/PROGRAMS/GIT%20and%20GITHUB/New%20folder/src/components/hero/UniversalBar.tsx)
- **OUTPUT**: A clean, reduced version of the main component in `src/components/hero/UniversalBar/index.tsx` (exporting it as `UniversalBar` for backward compatibility) importing the sub-components.
- **VERIFY**: Run `npx tsc --noEmit` and check that references in pages continue to function cleanly.

### Task 4: Create Shared ToolPage Layout Component
- **Task ID**: `TASK_TOOLPAGE_LAYOUT`
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `frontend-design`
- **Priority**: P1
- **Dependencies**: None
- **INPUT**: Layout structures from duplicate astro files.
- **OUTPUT**: New file `src/components/layout/ToolPage.astro` wrapping `<Layout>` and containing the main HTML body structure.
- **VERIFY**: Ensure the template accepts custom metadata and heading slots.

### Task 5: Refactor Generator Astro Pages
- **Task ID**: `TASK_ASTRO_PAGES`
- **Agent**: `frontend-specialist`
- **Skills**: `clean-code`, `frontend-design`
- **Priority**: P2
- **Dependencies**: `TASK_TOOLPAGE_LAYOUT`
- **INPUT**: astro landing pages.
- **OUTPUT**: Refactored `coding-prompt-generator.astro`, `instagram-caption-generator.astro`, and `linkedin-post-generator.astro` leveraging the new `<ToolPage>` layout.
- **VERIFY**: Ensure the pages render identically in the local dev server.

### Task 6: Harden Bulletproof API JSON Schema Output
- **Task ID**: `TASK_HARDEN_API`
- **Agent**: `backend-specialist`
- **Skills**: `clean-code`, `api-patterns`
- **Priority**: P2
- **Dependencies**: None
- **INPUT**: `src/pages/api/tools/bulletproof.ts`
- **OUTPUT**: Updated endpoint code forcing structured JSON responses and clean fallback handling for the LLM output.
- **VERIFY**: Execute local requests against the endpoint and check JSON schema conformity.

---

## Phase X: Verification Plan

### Automated Checks
- [ ] Type Check: `npx tsc --noEmit`
- [ ] Security Scan: `python .agents/skills/vulnerability-scanner/scripts/security_scan.py .`
- [ ] UX Audit: `python .agents/skills/frontend-design/scripts/ux_audit.py .`
- [ ] Build Verification: `pnpm run build`

### Manual Verification
- [ ] Verify recent prompt chips store items inside `localStorage` and trigger search enhancement cleanly.
- [ ] Verify "Make it Bulletproof" displays cards, accepts answers, and generates a merged result prompt correctly.
- [ ] Ensure mobile viewports display hamburger menu, hidden auth options, and correct button arrangements.
