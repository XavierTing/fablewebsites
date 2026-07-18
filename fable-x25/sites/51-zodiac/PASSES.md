# 51 · 生肖 THE TWELVE — Iteration Passes

Concept: an interactive Chinese-zodiac fortune wheel. A lacquered rotating 12-animal
wheel + a genuinely useful reading slip computed live from the sexagenary (干支) cycle.
Palette: Chinese red #c8102e + gold #c9a24b on deep lacquer-black; taiji center; cloud
& knot motifs. Fonts: Ma Shan Zheng (display 生肖 + hanzi), Noto Serif SC (body hanzi),
Space Grotesk (latin UI).

Screenshot protocol: `assets-pipeline/shot.mjs`, served over local HTTP on :8926.
Force-landed readings via `?year=1990` / `?animal=snake` (used for all shots).
Accuracy verified in-render: 2026 = 丙午 Fire Horse · 2024 = 甲辰 Wood Dragon ·
1990 = 庚午 Metal Horse · 2025 = 乙巳 Yin Wood Snake.

---

## Pass 1 — first render, whole page

Shots: 51-p1-desktop-wheel, 51-p1-desktop-reading (1990), 51-p1-mobile (1988),
51-p1-grid (#all-twelve), 51-p1-fh (#yearof), 51-p1-reck (#reckoning).

Found:
- **Hero overflow.** The display title 生肖 at clamp max 168px pushed the wheel ~40%
  below the fold at 1440×900 — only the top half of the wheel was visible. The tagline
  also broke to 3 lines with an orphan "fate."
- Wheel, taiji center, per-segment hanzi + emblems, the reading slip, the Twelve grid,
  the Fire-Horse fortune grid and the Reckoning all rendered correctly with zero console
  errors. Landing math correct (1988→Dragon, 1990→Metal Horse).
- Horse emblem read as a lone arch/curve — weakest of the twelve.

Changed:
- Title clamp 168→110px, tightened kicker/masthead/oracle padding, shortened tagline to
  2 lines, wheel max-width 560→452 so the whole hero composes inside 1440×900.
- Redrew the Horse emblem (clearer neck + muzzle + mane + eye).

## Pass 2 — hero fit + reading-state balance

Shots: 51-p2-desktop-wheel, 51-p2-desktop-reading, 51-p2-mobile, then 51-p2b-* re-shoots.

Found:
- Hero now fits; wheel fully visible with all 12 signs legible at rest.
- **Reading-state dead zone.** When the reading slip revealed, the wheel column
  vertically-centered against the tall slip, dropping the wheel to the bottom-left and
  cutting it off — a large empty upper-left region.

Changed:
- `.stage` → `align-items:start`; wheel column top-aligns (and is `position:sticky` on
  desktop); the control `.panel` gets `align-self:center` so it stays balanced beside the
  wheel in the empty state but lets the wheel hold the top in the reading state. Sticky
  disabled under 940px. Re-shot (p2b): wheel now fully visible next to the reading slip,
  no dead zone. 2024 mobile verified as 甲辰 Yang Wood Dragon.

## Pass 3 — placeholder, motion, edges, accuracy

Shots: 51-p3-reduced-motion, 51-p3-footer, 51-p3-mobile-grid, 51-p3-desktop-empty,
51-p3-mobile-empty, 51-p3-verify-2026, 51-p3-verify-animal.

Found:
- **Empty slip invisible.** The reading slip was `opacity:0` until revealed, so the
  no-reading state showed a dead gap where the slip sits (visible on mobile especially).
- Reduced-motion (emulated): wheel lands statically with no spin, slip revealed, zero
  errors — correct.
- Footer (大吉 / knot / back-link), mobile 2-col grid, Reckoning note, `?animal=` path,
  and the 2026=丙午 Fire-Horse reading all correct.

Changed:
- Made the slip always visible as a cream fortune-slip **placeholder** (corner brackets +
  faint dragon emblem + "Enter your birth year…" prompt); animate only the reading body in
  via a `slipin` keyframe (disabled under reduced-motion). The empty state now reads as a
  finished product on both widths.

Result: zero console errors at 1440×900 and 390×844 across every state (empty, landed,
reduced-motion, all sections). All zodiac math verified accurate against the classical
almanac. Back-link reads "XAVIER FABLE ×55".
