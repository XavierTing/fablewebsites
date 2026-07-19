# 姓名學 · THE NAME — Iteration Passes

A **real** 五格剖象法 (Five-Grid) name engine, cast in code and rendered as a naming-master's
desk (正名齋 · the Rectifier's Desk). The visitor types a Chinese surname + given name; the site
counts each character's **康熙 traditional strokes**, raises the Five Grids — 天格 heaven, 人格
the self, 地格 earth, 外格 outer, 總格 total — maps each grid number onto the **81 數理** (吉 /
半吉 / 凶 with a short meaning), reduces the top three to their **五行** and judges the **三才配置**
by 生剋, then scores the whole name and writes a plain-language read of the element it emphasises.
A "suggest a name" tool proposes single-character given names whose strokes raise an auspicious
人格/總格 in a chosen element.

Fonts: **Ma Shan Zheng** (the large calligraphic name + 五格 character column) · **Noto Serif
SC** (Chinese display + body 漢字) · **Spectral** (serif English body) · **IBM Plex Mono** (grid
numbers, data, small caps). Warm-paper #F5F1E8 / ink, cinnabar-seal #AC3E2C, jade #3F7050 +
brass; a 米字格 calligraphy-practice grid behind each name character.

Screenshots served over `python3 -m http.server 8938`, captured with `assets-pipeline/shot.mjs`
(+ a domcontentloaded scroll-shot for mid-page sections). `?name=王力宏` or
`?surname=…&given=…` force a report; `?boost=wood` presets the helper element.

---

## Correctness — the maths that matters

**Five-Grid formulas** (single / compound surname × 1-, 2-, 3-character given name):
`天格` = surname (+1 if single-char) · `人格` = last surname char + first given char ·
`地格` = given name (+1 if single-char) · `總格` = every stroke summed ·
`外格` = 2 (1+1) / last-given+1 (1+n) / surname₁+1 (2+1) / surname₁+last-given (2+n).
`三才` = 天·人·地 reduced by last digit → 1-2 木, 3-4 火, 5-6 土, 7-8 金, 9-0 水; the 配置 verdict
is derived from the 生剋 relations of the adjacent elements (相生 +2 / 比和 +1 / 洩 0 / 相剋 −1 /
逆剋 −2 → 大吉·吉·半吉·凶).

**Verified (node, KX table extracted from the shipped file — 0 fallbacks):**

| Name | 天 | 人 | 地 | 外 | 總 | 三才 |
|------|----|----|----|----|----|------|
| 王力宏 (王4 力2 宏7) | 5 | 6 | 9 | 8 | 13 | 土土水 |
| 李安 (李7 安6) | 8 | 13 | 7 | 2 | 13 | 金火金 |
| 林徽因 (林8 徽17 因6) | 9 | 25 | 23 | 7 | 31 | 水土火 |
| 欧阳修 (歐15 陽17 修10) | 32 | 27 | 11 | 16 | 42 | 木金木 |
| 张爱玲 (張11 愛13 玲10) | 12 | 24 | 23 | 11 | 34 | 木火火 |

王力宏 → 5/6/9/8/13 matches the documented standard result. Stroke table = ~430 curated 康熙
traditional values (百家姓 surnames + common given characters, radicals counted by root:
氵=水4, 艹=艸6, 辶=辵7, 王=玉5, numerals by value). Unknown characters fall back to an
approximate 9 **and** raise an on-page warning offering a per-character stroke override.

---

## Pass 1 — first render (`63-p1-*`)
**Captured:** hero (1440 + 390), the 五格 diagram, nameplate, 三才, reading, helper.

**Worked immediately:** the classic 五格剖象 chart rendered correctly — a central column of the
name characters in 米字格 boxes (surname cinnabar, given ink) with a dashed 太極 1 imaginary node,
five element-tinted medallions (天格5 土 吉 · 人格6 土 吉 · 地格9 水 凶 · 外格8 金 吉 · 總格13 火 吉)
fanned to their character groups by element-coloured curves; the 主運 tab on 人格; the 三才 stack
with 比和 / 相剋 arrows and a correct 半吉 verdict; the reading correctly named 土 Earth as the
emphasised element and 木 Wood as absent; the helper returned auspicious Wood-boosting characters.
**NO_CONSOLE_ERRORS** at 1440; Ma Shan Zheng brush + Spectral + Plex Mono all loading (confirmed
`document.fonts.check(…, '王')` = true, and a side-by-side brush-vs-serif render).

**Problems found:**
- **Nameplate score-ring overlap:** the absolute top-right 80/100 ring collided with the third
  tag (半吉 三才) and its "AUSPICIOUS" caption bled underneath.
- Nameplate stroke subline read awkwardly (`4 + 2+7 strokes`).
- Helper suggestions were monotonous — six identical 人格 11 rows (mathematically correct but read
  as a bug).

**Changed:** added `padding-right:180px` to `.np-meta` (reset to 0 in the ≤880px stack) so tags
clear the ring; rewrote the subline to `王 4 · 力 2 · 宏 7 康熙 strokes · single surname`; capped
the helper at 3 characters per 人格 value so the set now spans 人格 11 **and** 21.

---

## Pass 2 — fixes, mobile & robustness (`63-p2-*`)
**Captured:** fixed nameplate, helper, **mobile** nameplate + grids (390), compound surname 欧阳修.

**Verified:** the ring no longer overlaps; subline reads cleanly; the helper now shows a range of
strokes/numbers. Mobile stacks the nameplate (mizige boxes → tags → ring → seal) and scales the
五格 SVG down while staying legible; the grid cards fall to a 2-column mobile grid.

**Problem found (real data bug):** 欧阳修 rendered **人格 26 / 地格 11→10** — i.e. 修 was hitting
the approximate-9 fallback. An audit of every preset character exposed three genuine gaps in the
stroke table: **修, 静, 敏** were absent.

**Changed:** added 修=10, 静(靜)=16, 敏=11 (+ a few more common name characters). Re-extracted the
KX table from the shipped HTML and re-ran all five presets in node → **0 fallbacks**, all values
matching the hand calculation.

---

## Pass 3 — final sweep (`63-p3-*`)
**Captured:** hero desktop + mobile (standard tool), the fixed 欧阳修 grids, the diversified helper.

**Verified:** 欧阳修 now reads **32 / 27 / 11 / 16 / 42** (木金木) — correct. Standard `shot.mjs`
reports **NO_CONSOLE_ERRORS at both 1440×900 and 390×844**. A `prefers-reduced-motion: reduce`
emulation confirmed all 14 `.reveal` sections paint immediately (shown 14/14) and the SVG + name
plate render with **0 errors** — motion is fully guarded (JS sets final states; CSS forces the
reveal). Details present: styled scrollbar, ::selection, :focus-visible seal outline, paper grain
+ vignette, brush 名 watermark, cinnabar 印章 seal (name set vertically), drop-cap reading, and a
back-link reading **XAVIER FABLE ×65**.

**Result:** no outstanding problems. Five-Grid maths verified against the documented 王力宏 result
and four more names; every preset character exact; UI clean, cohesive and intentional at both
widths; zero console errors; reduced-motion respected.
