# 39-kaleido — KALEIDO · iteration passes

**Concept:** *KALEIDO — an engine of symmetry.* A living generative kaleidoscope:
a single drifting wedge of domain-warped colour, folded live into **N-fold
dihedral symmetry** (N rotations, each mirrored, so the mirror seam never shows)
to form a continuously turning, morphing rose window. The whole scene — source,
fold, stained-glass "leading", central light-well, engraved gold ring, warm
cream stage with soft cast shadow, and the cursor's symmetric paint blooms — is
drawn in a **single fullscreen fragment shader** (WebGL2, one triangle, no
textures). The cursor *paints into the wedge*: a single dab blooms in every petal
at once because the paint is compared in folded space.

Stage aesthetic: a warm **cream / ivory** stage holding a luminous jewel mandala
— a deliberately bright, joyful counterpoint to the collection's darker pieces.
Fonts: **Space Grotesk** (display/body) + **Space Mono** (labels, data, numbers).

Served over local HTTP on **port 8914** (`python3 -m http.server 8914`).
Screenshots at 1440×900 and 390×844 via `shot.mjs`, `waitMs` ~4000. **Every shot
in every pass reported `NO_CONSOLE_ERRORS`.** DPR capped at 2; internal render
scale 0.9 desktop / 0.62 mobile; rAF pauses on `visibilitychange` **and** when
the hero scrolls out of view; `prefers-reduced-motion` / `?static` render one
static gorgeous frame. Query overrides `?sym=6|8|12|16|24`, `?palette=jewel|
pastel|neon|autumn|mono-gold`, `?speed=`, `?scroll=`, `?t=`.

## Pass 1 — `39-p1-desktop.png`, `39-p1-mobile.png`

Found (art-director critique):
1. Composition, gold ring, cream stage, controls dock and top-bar "museum label"
   framing all landed well; strong 12-fold symmetry and a luminous centre.
2. **Colour read as psychedelic tie-dye**, not a designed rose window. The
   palettes had no distinct identity — jewel was as bright/electric as neon.
   Too many thin concentric rainbow rings (dartboard effect) rather than broad
   jewel cells held by dark leading.
3. **Desktop scroll-cue** ("the story, below") sat over the busy mandala and was
   illegible noise. (On mobile it was fine — it fell in the cream margin.)

Changed:
- **Deepened the jewel palette** (darker base, richer saturation) so it reads as
  deep sapphire / emerald / gold rather than neon; kept neon bright and electric
  so the five palettes are now clearly distinct.
- Broadened the colour cells: lowered the ring frequency (`sin(r·13)`→`r·6.4`),
  compressed the colour scalar, and **strengthened the leaded "cames"** (darker,
  wider) for a genuine stained-glass look.
- Moved the scroll cue to a **vertical label in the left cream margin** on
  desktop (`writing-mode:vertical-rl`), reset to bottom-centre on mobile.

## Pass 2 — `39-p2-desktop.png`, `39-p2-neon24.png`, `39-p2-autumn8.png`, `39-p2-pastel6-mobile.png`, `39-p2-content1/2.png`, `39-p2-footer.png`, `39-p2-static.png`

Found:
1. Big win — jewel now reads as a deep sapphire-and-gold rose window with clear
   leading. Verified the query API across combos: **`?sym=24&palette=neon`**
   (electric), **`?sym=8&palette=autumn`** (teal/amber ceramic plate),
   **`?sym=6&palette=pastel`** mobile (soft mint/ice snowflake) — all distinct
   and gorgeous. `?static` renders a still frame reading "jewel · frozen".
2. **Fixed top-bar chrome collided with content** on scroll — the KALEIDO
   wordmark, the live readout, and (worst) the back-link overlapped section
   headings/body, reading as a bug.
3. Content sections, the symmetry fold-spec strip (6/8/12/16/24 SVG mandala
   glyphs), pull-quote and the gradient KALEIDO footer masthead all read well.

Changed:
- On scroll (`scrollY>40`) the **wordmark + readout fade/slide out**; the
  back-link stays findable but becomes a subtle **frosted chip** so it is legible
  over any content or the mandala without looking like a collision.
- Controls dock still fades out once past 55% of the hero (chrome only matters
  while the mandala is on screen); back-link "XAVIER FABLE ×50" retained per brief.

## Pass 3 — `39-p3-desktop.png`, `39-p3-brewster.png`, `39-p3-content.png`, `39-p3-mobile.png`, `39-p3-mobile-content.png`, `39-p3-painted.png`, `39-p3-reducedmotion.png`

Verified (all clean):
- **Desktop hero**: a slowly-turning deep-jewel rose window with dark leading,
  a fine engraved gold ring, a soft cast shadow on the cream stage, vertical
  scroll cue, and the museum-label top bar.
- **Scrolled content** (`?scroll=0.42/0.62`): wordmark + readout gone, back-link
  a tidy chip; headings, two-column body, fold-spec strip, Brewster + mandala
  feature rows all clean. **Mobile** hero + content reflow correctly (fold strip
  → 3-up; feature discs stack).
- **Cursor paint** (`39-p3-painted.png`, simulated pointer spiral): a single
  scribble blooms **12-fold symmetrically** into luminous light with the brush
  cursor tinting to the live hue.
  - *Fix during this pass:* dense scribbles were blowing out to flat white.
    Accumulated paint is now softened (`1-exp(-paint·1.15)`) with a tighter
    falloff and faster decay, so it glows as coloured light with the mandala's
    structure preserved instead of nuking to white.
- **Reduced motion** (`39-p3-reducedmotion.png`, emulated `prefers-reduced-motion`):
  one static gorgeous frame, freeze control shows "play", readout "jewel · frozen".

No console errors in any pass, at either width, in any state (hero, scrolled,
painted, static, reduced-motion). Passes complete.
