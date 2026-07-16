# 剪紙 · JIANZHI — Iteration Passes

**Concept:** A generative Chinese paper-cutting (剪紙 jiǎnzhǐ) studio. A square of red rice-paper
is "folded" and, on a single cut, unfolds into an intricate, perfectly symmetric rosette. Each
rosette is built the way real folded-paper cutting works: a motif is generated in one half-wedge
(petals, crescents / 月牙, sawtooth / 锯齿, dot-lattice, cloud layers, leaf buds) then **mirrored and
rotated** to dihedral symmetry (6-, 8-, or 12-fold). The cut-away **negative space** is the art —
rendered as an SVG `mask` (white paper disc minus black holes) so the warm backing shows through,
with a CSS `drop-shadow` giving the "lifted off the surface" look. Seeded (`mulberry32`) so every
generation is unique yet always traditional-looking.

**Fonts:** `Ma Shan Zheng` (brush display for the 剪紙 title) · `Noto Serif SC` (hanzi UI, headings,
and the cut-in 福/囍 characters) · `Space Grotesk` (Latin UI, kickers, labels).

**Palette:** rice-paper cream `#f3ece0` · Chinese red / vermillion `#c8102e` (radial-graded paper)
· gold `#c9a24b` accents · ink `#2a211c` text.

**Tech notes:** pure vanilla JS + SVG (no WebGL, no CDN JS — only Google Fonts). Symmetry is done
with nested `<g transform="rotate()">` + `<g transform="scale(-1,1)">` around a centered viewBox, so
the browser instantiates 2N copies of one half-wedge. Presets bias the motif vocabulary and choose
the centre element (character glyph, animal silhouette assembled from primitives, or a bloom flower).
`?seed=`, `?preset=`, `?sym=` and `?unfolded=1` are all implemented; `prefers-reduced-motion` shows
the design already-unfolded with no fold overlay and no bloom animation.

Shots live in `passes/` (desktop 1440-wide, mobile 390-wide). **Zero console errors** verified at
both widths and across the CUT interaction, the Save SVG/PNG handlers, and reduced-motion.

---

## Pass 1 — first full read at both widths

**Reviewed:** hero (title, tagline, stage), all 7 presets, 6/8/12-fold symmetry, window-flower
gallery, tradition columns, footer. Screens: `33-p1-desktop-fu`, `33-p1-desktop-peony`,
`33-p1-mobile-dragon`, `33-p1-desktop-full`.

**Working well:**
- The papercut reads as **genuinely intricate jiǎnzhǐ** — scalloped lace edge, dotted borders,
  petal rings, crescent/月牙 rows, dot-lattice, and a clean cut-in 福 character. Not a crude polygon.
- The masked red-on-cream with the drop-shadow sells the "cut from paper, lifted" illusion.
- Peony bloom (6-fold) and the backlit 窗花 window-gallery both landed on the first try.
- Zero console errors at 1440 and 390.

**Problems found:**
1. **Museum label hidden.** The `.label` under the stage was being covered by the `.backing`'s
   bottom overflow (`inset:-7%` ≈ 39px) while the flex `gap` was only 16px — the label sat *behind*
   the opaque backing. Visible in `33-p1` desktop.
2. **Dead zone before the footer** — `.tradition` bottom padding + `.pull` margin + `footer`
   margin stacked to ~260px of empty cream.
3. Animal presets left a **plain red "moat"** between the centred silhouette and the rosette.

---

## Pass 2 — spacing, label, and centre-medallion fixes

**Changed:**
- Reduced `.backing` overflow to `inset:-5%` and raised `.stage-wrap` gap to `clamp(40px,6vh,58px)`
  so the label clears the paper + soft shadow. Label now reads cleanly on desktop and mobile
  (`33-p2-mobile-fu`, `33-p2-label-hidden-bug` = the before shot).
- Tightened `.tradition` padding-bottom, `.pull` margin, and `footer` margin-top → the pre-footer
  dead zone is gone.
- **Enriched the animal medallion:** added a ring of inward-pointing petals + a scalloped dot-ring
  framing every silhouette, turning the plain moat into an intentional medallion
  (`33-p2-rabbit-medallion`, `33-p2-tiger`, `33-p2-xi`).

**Verified:** rabbit / tiger / crane / dragon silhouettes all read at a glance; 囍 double-happiness
renders crisply in its scalloped roundel.

---

## Pass 3 — interaction, motion & final polish

**Reviewed & verified:**
- **The unfold ritual.** On load the stage shows only a **folded red square** (crease lines, dashed
  cut-line, scissors, 折·待剪 label) on the backing — fixed a bug where the finished rosette was
  *peeking out behind* the fold by holding the paper at `opacity:0` until the cut. Driving a real
  `#cutBtn` click in Puppeteer confirmed: fold animates away, paper blooms open (clip-path circle +
  scale/rotate settle), the button relabels to 新纹样·NEW CUT, and a fresh seed is generated
  (`33-p3-folded`, `33-p3-revealed`).
- **Reduced-motion** (`prefers-reduced-motion:reduce`, emulated): design shown already-unfolded, no
  fold overlay, no bloom — as required (`33-p3-reduced-motion`). Zero errors.
- **Save SVG / Save PNG** handlers exercised without throwing (standalone SVG with cream ground +
  `feDropShadow`; PNG rasterised to a 1400² canvas).
- Full-page re-read desktop + mobile (`33-p3-desktop-full`, `33-p3-mobile-full`): hero, controls,
  window gallery, tradition, pull-quote, footer all compose with intentional rhythm at both widths.
- Parallax "lift" (pointer tilt + shadow shift) and hover states on every control confirmed.

**Result:** all 7 presets × 3 symmetries produce harmonious, museum-precise cuts; the crane and
dragon silhouettes read clearly inside their medallions; no overflow, no default-browser elements,
zero console errors anywhere.
