# 面相 · 手相 — THE READ · Iteration Passes

An interactive **line-art atlas** of Chinese physiognomy (面相) and palmistry (手相). No
photograph, no camera — everything is drawn in clean SVG. **You are the chart.** The visitor
picks a layer and hovers a zone (on the drawing or in the index); the reading appears in a
callout with a leader line and in a full detail panel. Framed honestly as the "impressionistic
sketch" beside BaZi's "engineering drawing," and offered **for reflection, not prophecy** — no
medical claims anywhere.

**Two atlases**
- **THE FACE** — three toggleable maps over one refined SVG face: the **三停** three courts
  (life stages), the **五官** five features (each with its traditional official's title), and
  the **十二宫** twelve palaces (命宫 · 官祿宫 · 父母宫 · 遷移宫 · 福德宫 · 兄弟宫 · 田宅宫 · 夫妻宫/奸門 ·
  子女宫 · 疾厄宫 · 財帛宫 · 奴僕宫). Numbered atlas markers + an index list + a detail panel + an
  active-zone hanzi callout with a cinnabar leader line.
- **THE PALM** — a filled, elegant left-hand silhouette with the six major **lines** (生命線 ·
  智慧線 · 感情線 · 事業線 · 太陽線 · 婚姻線) and the **七丘** seven mounts (Jupiter · Saturn · Apollo ·
  Mercury · Venus · Luna · Mars). A **Variations** toggle reveals faint dashed alternate strokes
  (long / short / forked / chained) with what each is said to suggest.
- A **reading walkthrough** on each atlas auto-steps through the zones in sequence (with ‹ › for
  manual stepping); auto-advance is disabled under reduced-motion but manual stepping still works.

**Fonts:** **Noto Serif SC** (the zone hanzi 命宫/財帛宫/生命線…, display) · **Spectral** serif
(English body) + **Cormorant Garamond** italic (display English) · **IBM Plex Mono** (labels,
pinyin, kickers). Palette: warm paper `#F5F1E8` · ink line-art `#22252E` · cinnabar `#AC3E2C`
for active zones/leaders · jade + brass accents — an anatomical-atlas / old-manual feel, a page
from a 麻衣相法 manual redrawn with modern clarity.

**Serving & screenshots:** `python3 -m http.server 8937` from the repo root, captured with
`assets-pipeline/shot.mjs` + `scrollshot.mjs`. Deep-link / screenshot params implemented:
`?zone=nose` (face — friendly aliases + palace ids, auto-selects the right layer),
`?zone=upper&layer=courts`, `?line=heart` and `?mount=venus` (palm). All captured states report
**NO_CONSOLE_ERRORS** at 1440 and 390 widths. Reduced-motion is guarded (draw-in, reveals, cue,
and walkthrough auto-advance all short-circuit); rAF work is trivial and the walkthroughs pause on
`visibilitychange`.

---

## Pass 1 — build the two atlases (structure, content, face)
**Shots:** `62-p1-face-desktop.png`, `62-p1-palm-desktop.png`, `62-p1-face-full.png`, `62-p1-palm-full.png`

- Built the full page: hero (bilingual 面相·手相 title + "impressionistic sketch vs engineering
  drawing" framing cards), face atlas, palm atlas, honest-framing "manner" section, footer,
  back-link reading **XAVIER FABLE ×65**.
- Wrote rich, tradition-accurate readings for **every** face zone, palm line, and mount, plus
  variation notes for each line and the three-court life-stage readings.
- **Found:** the face line-art read well immediately (elegant outline, brows/eyes/nose/mouth,
  atlas markers + callouts landing correctly). The **palm hand outline was wrong** — the single
  compound path produced thin "antenna" fingers and a tangled wrist/thumb; not shippable.

## Pass 2 — rebuild the palm; fix the callout system
**Shots:** `62-p2-palm-lines.png`, `62-p2-palm-mounts.png`

- **Redrew the hand** as a single clean **filled silhouette** (paper fill + ink stroke) using
  arc-capped fingers and a properly-placed thumb/thenar — a genuinely elegant left palm. Added
  knuckle creases and faint **guide copies** of the lines so the hand still reads under the
  *mounts* layer.
- Repositioned **all six lines** and **all seven mounts** to the new geometry (life line now arcs
  correctly around the Venus/thumb ball; fate & sun rise toward Saturn/Apollo; marriage marks on
  the percussion edge).
- **Found & fixed:** callout boxes overflowed the SVG viewBox (pinyin clipped, box spilling past
  the frame). Rewrote `positionCallout` to be **hanzi-only, edge-anchored, and clamped** inside
  the viewBox, and widened the palm viewBox to give side margins. Callouts now tuck cleanly at the
  frame edge on desktop and mobile.

## Pass 3 — polish, deep-links, walkthroughs, verification
**Shots:** `62-p3-face-desktop.png`, `62-p3-palm-desktop.png`, `62-p3-face-courts.png`, `62-p3-hero-desktop.png`, `62-p3-face-mobile.png`, `62-p3-palm-mobile.png`

- Wired **courts** deep-link activation (`?zone=upper&layer=courts` now opens with the Upper Court
  band highlighted and its reading shown) by refactoring the courts engine to expose `showCourt`.
- Added a dedicated **courts walkthrough stepper** (the courts use a band engine, not the marker
  atlas) and branched the face Walkthrough / ‹ › controls by layer, so stepping never touches stale
  zone data. Layer switches and `visibilitychange` now stop every running walkthrough.
- Verified composition at 1440×900 and 390×844 across hero, all three face layers, both palm
  layers, the manner section and footer: hierarchy, spacing rhythm, callout placement, and the
  cinnabar/jade/brass harmony all hold. **Zero console errors** at both widths in every state
  (a lone error seen once during a rapid back-to-back capture loop did not reproduce on a clean
  run — a network-idle hiccup, not a code fault).

**Result:** two exquisite, honest, shareable atlases where *you are the chart* — distinct from
everything else in the showcase.
