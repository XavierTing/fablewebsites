# DEEPER — iteration log

**Site:** `sites/12-fractal/` · "DEEPER — an infinite descent"
**One-liner:** A guided WebGL2 infinite-zoom expedition into the Mandelbrot set — five named stations, smooth-iteration navy→teal→cyan→gold coloring, perturbation-theory deep zoom to a centered minibrot.
**Fonts:** Space Grotesk (display / caps / UI, weights 300–500) + Cormorant Garamond italic (verses & subtitle).
**Renderer:** float64 CPU reference orbit + float32 GPU delta iteration with Zhuoran rebasing (perturbation theory), so the deepest station stays crisp and within float32 precision — no pixelation or banding.

Screenshots captured at 1440×900 (`-d0/-d2/-d4`) and 390×844 (`-m`) via the shared `shot.mjs`. All passes reported **NO_CONSOLE_ERRORS** at both widths.

---

## Pre-pass — finishing incomplete functionality

The original builder was cut off "while testing zoom targets." The renderer, HUD, stations, meter, `?depth=N` jumps, drag-pan, double-click dive and surfacing were all present and working — but the **terminal station (The Heart of the Set) was broken**: the camera's final centre converged exactly onto the in-set reference point, so the deepest frame was mostly dead-black interior with the interesting structure shoved into the corners (see `12-p1-*` prior to this run). Iterations were also under-budgeted for extreme depth.

Fixes before the formal passes:
- Raised iteration budget: shader loop cap 3200→4096; `MAXITER_CAP` 2600/1500 → 4000/2000; iteration ramp `110+d10·150` → `160+d10·260`. Deep detail now resolves instead of collapsing to flat interior.
- Swept the final scale (`S_END`) at depth 4 across ×1.5B / ×10B / ×60B / ×250B. Chose **×60B (`S_END = 8e-11/aspect`)** — it frames a prominent, centred **minibrot** (a self-similar copy of the whole set) ringed by spiral galaxies: the perfect thematic payoff, and well inside float32 precision (previous ×250B was both emptier and nearer the precision floor).
- Updated meta-description magnification to match (×60,000,000,000).

---

## Pass 1 — critique of the corrected build
Screenshots: `12-p1-d{0,2,4}.png` + `-m`.
- **Surface (d0)** and **Seahorse Valley (d2)** — gorgeous; coloring, captions, meter all reading well.
- **Found:** at bright deep stations, the fixed light-colored chrome (backlink, status, magnification readout, meter labels) washed out against the luminous teal fractal — e.g. d4's "×60,000,000,000" and top-left "FABLE ×25" were near-illegible.
- **Found:** mobile **d4** (portrait) — the minibrot overflowed the narrow frame into a big black blob because the terminal scale held complex *height* constant; portrait frame was narrower than the minibrot.
- **Fixed:** added a dark text-shadow halo to `.chrome` and `.mlabel` for universal legibility on any background. Made the terminal scale aspect-aware (`S_END = 8e-11/aspect`) so the minibrot's complex *width* is constant across landscape/portrait.

## Pass 2 — verifying the fixes
Screenshots: `12-p2-d{0,2,4}.png` + `-m`.
- Chrome now legible over bright teal at d4/d2 (desktop + mobile).
- Mobile **d4** now frames the centred minibrot (×40B) instead of the black-blob overflow — resolved.
- **Found:** mobile **d0** intro overline ("FABLE ×25 · EXPEDITION N°12 · THE MANDELBROT SET") wrapped to two lines and collided with the DEEPER wordmark; the italic subtitle was low-contrast over the fractal.
- **Fixed:** mobile override on `.over` (smaller size, tighter tracking, side padding) so it holds one line; added text-shadow to intro `.over` / `.sub`.

## Pass 3 — final polish verification
Screenshots: `12-p3-d{0,2,4}.png` + `-m`.
- Mobile d0 overline now sits on a single line above the wordmark; subtitle reads cleanly.
- All three depths at both viewports read as intentional, gorgeous, and artifact-free. No further issues found.

---

## Requirements verified (headless)
- Favicon `<link rel="icon">` present (🌀 inline SVG). ✔
- `FABLE ×25` back-link `href="/"`. ✔
- Zero console errors at 1440×900 and 390×844 across all passes. ✔
- `prefers-reduced-motion`: emulated run holds at "Surface · descent 0%" after 6 s (no auto-descend; entrance animation disabled). ✔
- rAF pauses when hidden: `visibilitychange` handler toggles `running` on `document.hidden`. ✔
- devicePixelRatio capped at 2 (1.5 on small); adaptive internal render-scale for weak GPUs. ✔
