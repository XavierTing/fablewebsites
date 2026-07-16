# 35-aurora — AURORA · iteration passes

**Concept:** *AURORA — a night that answers.* A full-viewport WebGL2 aurora
borealis over a still northern lake at 68.4°N (Abisko). The entire scene —
domain-warped auroral curtains with vertical ray structure and substorm pulses,
a twinkling star field + Milky Way + shooting stars, a silhouetted fir/mountain
ridge with a warm-windowed cabin, and a rippled lake mirror — is drawn live in a
**single fullscreen fragment shader** (one triangle, no textures).

Served over local HTTP (`python3 -m http.server 8910`). Screenshots at 1440×900
and 390×844 via `shot.mjs`, `waitMs` 4200–4500. **Every shot in every pass
reported `NO_CONSOLE_ERRORS`.** DPR capped at 2; internal render scale 0.82
desktop / 0.62 mobile (heavy shader); rAF pauses on `visibilitychange`;
`prefers-reduced-motion` and `?static` render one still frame with drift off.

## Pass 1 — `35-p1-desktop.png`, `35-p1-mobile.png`

Found (art-director critique):
1. Aurora read a little **smoky/hazy** — soft green fog rather than crisp
   luminous curtains. Vertical ray structure too weak; curtain lower borders
   ("hems") undefined; not enough contrast between curtains and dark gaps.
2. Lake reflection present and correct, but **too dark** — the mirrored aurora
   barely glowed.
3. **Milky Way** almost invisible.
4. Mobile: **AURORA title overflowed** the right edge; **pine comb too fine/busy**
   in portrait (teeth count was in uv-space, so it shrank on narrow screens);
   **controls dock overflowed** (drone button clipped); KP tag crowded the dock.

Changed:
- Rebuilt the per-curtain vertical profile: a crisp gaussian **hem line**
  (`exp(-aH²·300)`) plus upward-fading rays with ragged per-x top height.
- **Vertical rays** now mostly x-varying (`fbm(sxw·11, sh·0.42)`) with
  `pow(rays,1.7)` contrast → long luminous striations instead of blotches.
- Narrowed cores, cut halo, brightened cores → defined curtains, darker gaps.
- Milky Way amplitude ~1.5× + texture.
- Reflection: less depth-darkening (`exp(-depth·0.95)`), less water-tint mix →
  aurora & stars now clearly mirrored; bumped ripple amplitude.
- Pine `freq` now scales with aspect (`8+16·aspect`) so firs stay a sensible
  size on mobile; pointier triangles. Mobile title clamp lowered to fit; dock
  made compact + horizontally scrollable; `.val` labels hidden; KP moved to top.

## Pass 2 — `35-p2-desktop.png`, `35-p2-violet.png`, `35-p2-mobile.png`, `35-p2-science.png`, `35-p2-red.png`

Found:
1. Big win — curtains now crisp, with ray structure, bright hems and a glowing
   mirror. Violet & red palettes both read beautifully (red = green low /
   crimson tops, physically correct: `?palette=violet` / `?palette=red` verified).
2. **Fixed control dock permanently obscured content** when scrolled into the
   science section (real UX bug) — bottom body row hid behind the dock.
3. Tree line was a slightly **uniform comb** across the width — wanted natural
   clusters/gaps and a stronger left mountain.
4. **Cabin window** too faint (tiny amber marks); wanted a warmer glow for the
   "one warm window" contrast note.
5. Default sky felt active but KP read only "4.6 unsettled" — mismatch.

Changed:
- **Dock + KP fade/slide out** once `scrollY > 0.62·vh` (chrome only matters
  while viewing the sky); backlink stays findable per brief.
- Tree line: added a low-frequency **cluster envelope** (`0.45+0.85·noise`) and
  a taller left **mountain mass** → believable forest with gaps.
- Cabin window brighter (`×2.4`) with a larger, warmer amber **halo** bleeding
  into the night (and into the water via the reflection).
- Default `intensity` → 1.0 (KP now "5.2 · G1 active", matching the sky).
- Added a mobile-only **hero bottom scrim** so the wistful copy stays legible
  where it crosses the bright reflection.

## Pass 3 — `35-p3-desktop.png`, `35-p3-mobile.png`, `35-p3-science.png`, `35-p3-spectra.png`, `35-p3-footer.png`, `35-p3-static.png`, `35-p3-violet-mobile.png`

Verified (all clean):
- **Desktop hero**: luminous rippling green curtains with vertical rays, faint
  overhead corona, Milky Way, twinkling stars, clustered fir ridge + left
  mountain, warm cabin window, and a clearly-mirrored rippled lake. KP "5.2 · G1".
- **Mobile hero**: title fits; dock shows all controls; scrim keeps copy legible;
  reflection visible. Violet-mobile (`35-p3-violet-mobile.png`) equally strong.
- **Science / spectra / quote / footer**: dock + KP correctly hidden; typography
  clean (Space Grotesk display, IBM Plex Mono data); aurora bleeds softly through
  the section top for continuity; emission-line spectra (557.7 / 630.0 / 427.8 nm)
  read well; footer masthead + meta tidy; back-to-gallery link present.
- **Reduced motion / `?static`** (`35-p3-static.png`): a single breathtaking frame,
  play control shows "paused", camera drift off. Matches the brief.

Nothing new broke; passes complete. OG image (`assets/og.jpg`, 1200×630) rendered
from the live scene.
