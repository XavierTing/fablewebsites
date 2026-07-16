# FABLE ×25 — Shared Build Brief (read this fully before building)

You are building ONE site of a 25-site showcase demonstrating state-of-the-art web design. It will be seen by 500,000+ people. The bar is: "would a top motion-design studio ship this?"

## Hard requirements

1. **Self-contained folder**: `sites/<NN-slug>/index.html`. Local assets go in `sites/<NN-slug>/assets/`. CDN libs allowed (pin versions): Three.js (`https://unpkg.com/three@0.160.0/build/three.module.js` via importmap, or cdnjs), GSAP (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js` + ScrollTrigger), Google Fonts.
2. **`<title>` + meta description + a `<link rel="icon">` favicon** (inline SVG data-URI emoji favicon is fine — prevents 404 console noise).
3. **Back-link to the gallery**: a small, elegant, fixed element (top-left or bottom-left) reading `XAVIER FABLE ×35` linking to `/` — style it to match the site's aesthetic, unobtrusive but findable.
4. **Responsive**: fully composed at 1440×900 AND 390×844. Heavy 3D may simplify on mobile but the page must still look intentional.
5. **Zero console errors** at both widths (verified via the screenshot tool below).
6. **Motion quality**: ease curves matter. Nothing linear unless stylistically deliberate. Entrance animations, scroll choreography, hover states on every interactive element. Respect `prefers-reduced-motion` (guard heavy animation behind a check).
7. **Typography**: real typographic care — tight display leading, correct optical sizes, letterspacing on caps, fluid `clamp()` sizes. Use the fonts named in your concept brief.
8. **Copy**: write real, evocative copy for the fictional brand. No lorem ipsum. 3–6 sections of content minimum so the page has depth (hero + supporting sections + footer).
9. **Performance**: requestAnimationFrame loops must pause when tab hidden; cap devicePixelRatio at 2; images compressed.

## Iteration passes (MANDATORY — 3 minimum)

Screenshot tool: `node "/Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/assets-pipeline/shot.mjs" <file-or-url> <out.png> [width] [height] [waitMs]`
- Screenshot your `index.html` (absolute file path works) at 1440×900 and 390×844. Use waitMs ~4000 so animations settle.
- READ each screenshot with the Read tool. Critique like a merciless art director: composition, hierarchy, spacing rhythm, color harmony, contrast/legibility, dead zones, default-browser-looking elements, broken/black WebGL, overflow bugs.
- Fix everything you found, then repeat. **Three full passes minimum**; keep going if pass 3 still finds problems.
- For scroll-heavy sites also screenshot a mid-scroll state if possible (add `#hash` handling or a `?scroll=` query param you implement that jumps the page, or temporarily screenshot with extra waitMs).
- Log each pass in `sites/<NN-slug>/PASSES.md`: what you found, what you changed.
- WebGL renders in the headless browser. If your screenshot shows black/empty canvas, that's a REAL bug — fix it (check shader compile errors, module imports).

## Aesthetic guardrails

- Commit fully to the concept's aesthetic. Restraint > feature soup: fewer elements, executed perfectly.
- No default blue links, no unstyled scrollbars on themed sites (style `::-webkit-scrollbar` where it fits), no default focus ring clashes (style `:focus-visible`).
- Color: build the palette from the brief; check text contrast (WCAG AA for body text).
- Details are the showcase: custom cursors where fitting, selection color (`::selection`), scroll progress indicators, grain/noise overlays, vignettes — where they serve the concept.

## Return value

When done, return exactly: the site folder name, a one-line description, the font pairing used, and the number of passes completed with a one-line summary per pass.
