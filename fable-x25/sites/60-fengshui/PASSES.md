# 風水 · FENG SHUI — "acupuncture for a room" — Iteration Passes

A geomancer's blueprint on warm paper. Two connected, genuinely-computed tools:

1. **The Bagua map (八卦 · 九宫格)** — a rectangular floor plan drawn in SVG with a
   movable door, a 3×3 Bagua overlay mapping each of the nine palaces to a life-area,
   trigram, element, colour and a practical, common-sense adjustment (light / plants /
   clutter / mirrors). An **alignment toggle** switches the whole reading between the
   **黑派 Black-Hat** school (map fixed to the door — the entry wall is
   Career/Knowledge/Helpful) and the **罗盘 Compass** school (a 罗盘 dial sets the
   facing 朝向 and the entire nine-palace grid rotates with the compass). Click any
   zone → its reading card.

2. **Flying Stars (玄空飞星)** — a **real 挨星 engine**, not a lookup. Give it a
   construction period (元運, Period 9 / 2024–2043 by default) and a facing direction
   (24-mountain 天元 centre → one of 8), and it flies the 運盤 / 山盤 / 向盤 into all
   nine palaces and renders the 3×3 chart (S at top, traditional) with each palace's
   three numbers, a chart-type classification (旺山旺向 / 雙星到向 / 雙星到坐 /
   上山下水) and a plain-language read of the notable good/caution star combinations.

Served over local HTTP on **port 8935** and captured with
`assets-pipeline/shot.mjs` + `scrollshot.mjs`. Deep-link params implemented:
`?facing=S&period=8` (flying-star chart), plus `?zone=`, `?mode=compass`,
`?bfacing=` (bagua) and `?view=<section-id>` for section screenshots.
Fonts: **Noto Serif SC** (八卦 / hanzi + numerals) · **Cormorant Garamond**
(serif English) · **IBM Plex Mono** (directions / degrees / star numbers).
Palette: warm paper `#F5F1E8` / ink, jade `#2F6D5E`, cinnabar `#AC3E2C`,
brass `#9A7A34`. Distinct from the collection's architecture site (25) — that is
white-on-black Archivo minimalism; this is a warm scholarly divination-wing blueprint.

---

## Flying-Star engine — verification (挨星)

The engine was verified against the canonical textbook chart **Period 8, 子山午向
(sitting 坎/North, facing 離/South)** before the UI was wired. The documented
result is **雙星到向** (both period-8 stars fly to the facing/South palace):

```
        (山 向 運),  South at top
  SE 3 4 7    S 8 8 3    SW 1 6 5
  E  2 5 6    C 4 3 8    W  6 1 1
  NE 7 9 2    N 9 7 4    NW 5 2 9
```

Centre `山4 向3 運8`, and `山8 / 向8` both land in the South palace — exactly the
published 八運子山午向 chart. Method encoded: period number to centre flown 順;
向盤 centre = period number in the facing palace, 山盤 centre = period number in the
sitting palace; flight direction (順/逆) from the 天元 yin-yang of the resulting
centre number (`{1陰,2陽,3陰,4陽,6陽,7陰,8陽,9陰}`, with 5 taking the facing/sitting
mountain's own polarity). The default Period 9 子山午向 correctly resolves to
**雙星到坐** (both 9s to the sitting/North palace). Both checks reproduced in-browser.

---

## Pass 1 — first render + wiring (`60-p1-*.png`)
**Captured:** desktop hero, bagua (`?zone=SE`), flying-stars (`?facing=S&period=8`),
mobile — 1440×900 and 390×844.

**Worked immediately:** the whole layout, the warm-paper/blueprint atmosphere, the
hero **罗盘 luopan** (24 mountains + 360° degree ring + eight trigrams + needle drawn
in SVG), all three fonts, the Bagua grid + reading card, and the Flying-Star chart
(matching the verified P8 子山午向 = 雙星到向) all rendered correctly.

**Problems found:**
- **Critical console errors:** the hero luopan's `ring()` helper had its arguments
  swapped (colour passed where the radius was expected) → eight
  `<circle> attribute r: Expected length "rgba(…)"` errors at both widths.
- The screenshot server (single-thread `python -m http.server`) caused intermittent
  `networkidle2` navigation timeouts while the large CJK font subsets streamed.
- A stray placeholder line in `positionDoorAndRing()` reassigned the `door` state.

**Changed:** fixed `ring(stroke,r,w)` argument order (→ zero `<circle>` errors);
switched the server to a **threaded** `ThreadingHTTPServer`; removed the door-mutating
placeholder and dead SVG-line code. Re-verified with a dedicated error harness
(`waitUntil:'load'` + click **every** control): **NO_CONSOLE_ERRORS** at 1440 and 390,
including after toggling both alignment modes, all 9 periods, all 8 facings, every
Bagua cell and every compass button. (The `NAV: navigation timeout` shot.mjs still
occasionally prints is purely puppeteer's networkidle heuristic on the fonts CDN — it
is **not** a page console/pageerror; the harness confirms the page emits none.)

---

## Pass 2 — art-direction sweep (`60-p2-*.png`)
**Captured:** compass-mode bagua (`?mode=compass&bfacing=E`), full default
Period-9 flying-star chart, the schools strip, the nine-stars reference, the
Black-Hat plan with door, and mobile flying-stars.

**Verified fixed / correct:** compass mode rotates the whole nine-palace grid rigidly
and honestly — facing East gives sitting 坐 West at the top, 財位/巽 at SE, the door on
the East facing wall, and every corner direction-label matches its zone's trigram.
The default Period-9 chart computes to 雙星到坐 with the 五黃 centre and 二黑 palaces
correctly flagged; the reads are accurate and specific. Black-Hat mode draws the door
on the entry wall and moves it between the Knowledge/Career/Helpful gates.

**Problems found:**
- In compass mode the eight direction buttons sat on a **circular** ring, so the four
  intercardinal buttons landed **on top of the corner Bagua cells**, cluttering them
  and intercepting clicks meant for those zones.
- Deep-linking (`?view=`) scrolled section headings hard against the fixed
  `XAVIER FABLE ×65` back-link, clipping the first glyphs (most visible on mobile).

**Changed:** reseated the compass direction markers into the clean **margin** around
the plan (edge-midpoints + corners, outside the plan box), skipping the redundant
current-facing marker; shrank/​restyled them (brass hairline, jade hover). Added
`scroll-margin-top` to every `section` so anchored scrolls land below the back-link.

---

## Pass 3 — behaviour, motion & edge states (`60-p3-*.png`)
**Captured:** emulated `prefers-reduced-motion: reduce` desktop, a clean default
desktop, and mobile flying-stars after the scroll-margin fix.

**Verified:**
- **Reduced motion:** with the media feature emulated, `html.no-anim` is set and the
  luopan renders **fully but completely static** — no ring rotation, no needle sway,
  no reveal transitions — while every glyph, tick and trigram still draws. `NO_ERRORS`.
- **Deep-link headings** now clear the back-link at both widths.
- **Zero console errors** confirmed again at 1440×900 and 390×844 on the final build,
  including the full interaction sweep. `requestAnimationFrame` is used only for the
  scroll-progress bar (throttled, and re-synced on `visibilitychange`); all ambient
  motion is CSS and pauses when off-screen / under reduced-motion. devicePixelRatio is
  never forced above the browser default.

**Changed:** nothing structural — pass 3 confirmed the build.

---

### Result
A warm, scholarly, bilingual feng-shui instrument: a hand-drawn SVG 罗盘, an
interactive Bagua-over-floor-plan that honours both the door (Black-Hat) and compass
schools, and a genuine 玄空飛星 engine whose charts are computed by the standard 挨星
method (verified against the documented Period-8 子山午向 chart). Practical and
for-reflection in tone — no fear-mongering. Noto Serif SC · Cormorant Garamond ·
IBM Plex Mono on paper/jade/cinnabar/brass. Reduced-motion safe, zero console errors,
responsive at 1440×900 and 390×844.
