# Love4Prompts Editorial Design System

This document outlines the core principles, colors, typography, and component styles used in the new "Editorial Brutalist" theme (toggled via `theme="editorial"` in `Layout.astro`).

## 1. Core Philosophy
The design language is unapologetically bold, functional, and tactile. It uses high-contrast colors, harsh shadows, and heavy typography to create a "magazine print" or "poster" aesthetic. 

## 2. Color Palette
- **Base Background:** `#ffffff` (White)
- **Base Text/Borders:** `#000000` (Black)
- **Primary Brand (Replaced Red):** `#FF6D87` (Pinkish Red)
- **Secondary Highlight (Replaced Yellow):** `#1482A3` (Deep Cyan)
- **Subdued Text:** `#4c4546` (Dark Gray)

*(Note: Other palette colors available for future variation: `#FD9E98` (Peach), `#D8AFB5` (Dusty Rose), `#88959D` (Slate/Blue-Grey))*

## 3. Typography
The system relies on the `Inter` font family (or standard sans-serif fallbacks).
- **Headings (`h1`, `h2`):** Extremely bold (`font-black`), tight tracking (`tracking-tighter`), tight line height (`leading-none` or `leading-[0.9]`).
- **Body Text:** Clean, readable, slightly larger than standard (`text-lg` to `text-xl`), dark gray (`#4c4546`).
- **Labels/Buttons:** Uppercase (`uppercase`), wide tracking (`tracking-widest`), bold (`font-bold`), small size (`text-[10px]` to `text-[12px]`). Defined globally via the `.ed-label-caps` utility class.

## 4. Backgrounds & Textures
- **The Grid:** The signature background is a subtle graph-paper grid.
  - Achieved via an absolute background div using linear gradients:
    ```css
    background-image: 
      linear-gradient(to right, #0000001a 1px, transparent 1px),
      linear-gradient(to bottom, #0000001a 1px, transparent 1px);
    background-size: 40px 40px;
    ```

## 5. UI Components & Interactions

### Buttons & Cards (The "Brutalist Shadow")
Interactive elements feature thick borders and hard drop shadows that "press in" when hovered/clicked.

**Standard Button CSS Classes:**
```html
<button class="bg-[#bc0007] text-white border-[2px] border-black rounded-full px-6 py-3 font-bold uppercase tracking-widest shadow-[4px_4px_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
  Click Me
</button>
```
- **Key traits:** `border-[2px] border-black` and `shadow-[4px_4px_0_#000]`.
- **Hover trait:** The shadow disappears and the button moves down/right to simulate a physical button press (`hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`).

### Input Fields & Search Bars
Inputs maintain the brutalist aesthetic but are slightly muted.
- `border-[2px] border-black`
- `shadow-[4px_4px_0_#000]`
- Focus state: Outline none, maintain heavy border.

### Image Galleries (Pinterest Style)
Images in the library are presented in a masonry grid. 
- Images feature the same brutalist shadow: `border-[2px] border-black shadow-[4px_4px_0_#000]`.
- Hover interactions: Scale up slightly (`hover:-translate-y-1`), shadow increases (`hover:shadow-[6px_6px_0_#000]`).

## 6. Layout & Spacing
- **Paddings:** Generous paddings to separate the heavy elements. `pt-[120px]` on pages to clear the absolute-positioned header.
- **Max Width:** Content typically constrained to `max-w-7xl` and centered `mx-auto`.

## 7. Global CSS Utilities
Located in `Layout.astro`:
- `.editorial-page`: Scopes the styling to specific pages.
- `.ed-label-caps`: Standardizes the small, wide, uppercase font used for UI labels.
- `.ed-label-ui`: Standard UI font weighting.
