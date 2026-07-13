# PASSES — 18 · Atlas Water Authority, Annual Report 2026

Swiss/International-style annual report. Strict 12-column baseline grid, hand-built SVG
charts (animated area chart, proportional reservoir circles, slope chart, isotype
pictogram, small-multiple sparklines), one signal blue `#0047ff`, one red `#e63312`
for the single deficit/negative accent, faint grid toggle (press G).

Fonts: **Archivo** (display + body) / **IBM Plex Mono** (labels, figures, captions).

Screens captured with `scrollshot.mjs` at 1440×900 and 390×844, hero + all five chart
sections mid-scroll. Data verified self-consistent before pass 1:
- Monthly delivery sums to 412.0 BL.
- Reservoir capacities sum to 1,240 GL; held ≈ 859 GL = 69.3%.
- District consumption FY25 371.2 BL → FY26 383.2 BL.
- Cross-cast: 412.0 delivered = 383.2 metered + 28.8 non-revenue.

---

## Pass 1 — baseline audit (1440 + 390)

Shots: `18-p1-hero-1440`, `18-p1-ch1-area-1440`, `18-p1-ch2-reservoir-1440`,
`18-p1-ch3-slope-1440`, `18-p1-ch4-isotype-1440`, `18-p1-ch5-sparklines-1440`,
`18-p1-hero-390`.

**Console:** zero errors at both widths (all shots reported `NO_ERRORS`).

Findings:
- Hero: strong. Massive Archivo statement type, 412 in blue, baseline grid reads,
  back-link + grid toggle both present and on-brand. No change.
- Ch1 area chart: crisp 1px rules, direct peak/endpoint labels, tabular ticks. Good.
- Ch2 reservoirs: proportional circles, animated water fill, Redcrest deficit in red
  with dashed 45% floor line, live readout. Good.
- Ch3 slope chart: direct name+value labels both columns, +/− deltas, blue/grey
  encoding. Three districts clustered near 45 BL are label-relaxed and remain legible.
- Ch4 isotype: **BUG — pictogram drops render black instead of signal blue.** The rule
  `.drop path{fill:var(--blue)}` never matches: each drop is an SVG `<use>` of `#dropPath`,
  not a `<path>`. The key drop looked blue only because of its inline `fill`. This
  violated the one-signal-blue palette.
- Ch5 sparklines: clean small multiples, own-range scaling, endpoints labelled. Good.
- Mobile hero: composes correctly, no overflow.

Fix applied:
- `.drop path{fill:var(--blue)}` → `.drop,.drop use{fill:var(--blue)}` so the referenced
  drop geometry inherits the signal blue (applies to both animated and reduced-motion
  states).

---

## Pass 2 — verify fix + mobile charts (1440 + 390)

Shots: `18-p2-ch4-isotype-1440`, `18-p2-ch3-slope-390`, `18-p2-ch2-reservoir-390`.

**Console:** zero errors at both widths.

Findings:
- Ch4 isotype: **fix confirmed** — all pictogram drops now render in `#0047ff`; the final
  partial group of two fades correctly; count animates up to 412. One-signal-blue restored.
- Ch2 reservoirs on 390: 3-column grid, proportional circles preserved, Redcrest deficit
  in red with dashed floor line, system readout intact. Good.
- Ch3 slope on 390: **BUG — the longest left label "Meridian Central 68.4" clips its
  leading "M"** against the viewport edge (right-anchored label wider than the left gutter).

Fix applied:
- Added a mobile-only short-name map for the slope chart:
  Meridian Central → "Meridian Ctrl", Ironquay Industrial → "Ironquay Ind.",
  Larkspur Rural → "Larkspur R." so all left labels fit the mobile gutter.

---

## Pass 3 — re-verify + reduced-motion (1440 + 390)

Shots: `18-p3-ch3-slope-390`, `18-p3-rm-isotype-1440`, `18-p3-rm-area-1440`.

**Console:** zero errors.

Findings:
- Ch3 slope on 390: **fix confirmed** — "Meridian Ctrl 68.4" and all other left labels
  now fully visible, no clipping; relaxed cluster near 45 BL still legible.
- Reduced-motion (emulated `prefers-reduced-motion: reduce`):
  - Isotype renders in final state — count reads **412**, all 412 drops present and blue,
    no count-up, no drop-in animation.
  - Area chart renders fully drawn (clip at full width), no sweep animation.
  - Verified programmatically: `isoCount.textContent === "412"`.

**Verification summary**
- Favicon: inline SVG data-URI 💧 present (no 404 noise).
- Back-link `FABLE ×25` → `/` present (fixed top-left) and also in footer index.
- Grid toggle (press G / button) works; layout grid overlay in signal blue.
- Zero console errors at 1440×900 and 390×844 across all passes.
- Reduced-motion honoured: every chart resolves to its final static state.
- Data self-consistent and cross-casting (412 = 383.2 + 28.8).

No outstanding issues after pass 3.
