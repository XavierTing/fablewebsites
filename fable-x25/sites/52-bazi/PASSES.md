# 八字 · FOUR PILLARS OF DESTINY — Iteration Passes

A **real** BaZi (四柱 / Four Pillars) engine, cast in code and rendered as a scholarly
almanac. The visitor enters a birth date (+ optional 時辰); the site computes the four
pillars — 年柱 year, 月柱 month, 日柱 day, 時柱 hour — each a Heavenly Stem 天干 over an
Earthly Branch 地支, each character tinted by its Five-Element 五行 colour. It then derives
the Day Master 日主, the five-element balance (a 五行 pentagon with 相生/相剋 relations plus a
bar readout), the animal, yin/yang, and a rule-generated reading "for reflection."

Fonts: **Noto Serif SC** (the pillar hanzi + display) · **Space Grotesk** (latin headings)
· **IBM Plex Mono** (data, pinyin, chart numbers). Ink-on-aged-silk palette, gold rules,
a vermilion 命 seal.

Screenshots served over `python3 -m http.server 8927`, captured with
`assets-pipeline/shot.mjs`. `?date=YYYY-MM-DD&time=HH:MM` (and `&nohour`) force a chart.
All captures reported **NO_CONSOLE_ERRORS** at both 1440 and 390 widths.

---

## Day-pillar calibration (the accuracy that matters most)

The day pillar is computed from the **Julian Day Number** of the civil (Gregorian) date:

```
JDN = D + ⌊(153·m+2)/5⌋ + 365·y + ⌊y/4⌋ − ⌊y/100⌋ + ⌊y/400⌋ − 32045
      (a = ⌊(14−M)/12⌋,  y = Y+4800−a,  m = M+12a−3)
day ganzhi index = (JDN + 49) mod 60        // stem = idx%10, branch = idx%12
```

**Offset = 49**, calibrated and then cross-checked against four independent known dates:

| Date        | JDN      | (JDN+49) mod 60 | Pillar | Source |
|-------------|----------|-----------------|--------|--------|
| 1984-02-01  | 2445732  | 1               | 乙丑   | Cantian AI |
| 2000-01-01  | 2451545  | 54              | 戊午   | brief's stated known + Cantian AI |
| 1990-05-20  | 2448032  | 21              | 乙酉   | Cantian AI |
| 2026-07-18  | 2461240  | 29              | 癸巳   | Cantian AI |

All four agree → the day pillar is **exact**. (JDN(2000-01-01)=2451545 also matches the
canonical astronomical value, confirming the JDN formula itself.)

### Full-chart verification (node script, 11/11 PASS)

- **Year** (立春 boundary fixed to Feb 4): 2024-06-01 → 甲辰 ✓ · 2026-06-01 → 丙午 ✓ ·
  2026-01-15 → 乙巳 ✓ (pre-Lichun rolls to 2025) · 2026-02-03 → 乙巳 ✓ · 2026-02-04 → 丙午 ✓
- **Day**: 2000-01-01 → 戊午 · 1984-02-01 → 乙丑 · 1990-05-20 → 乙酉 · 2026-07-18 → 癸巳 ✓
- **Month** (五虎遁, approx. 節 dates): 1990-05-20 → 辛巳 ✓
- **Hour** (五鼠遁): 1990-05-20 14:30 → 癸未 ✓
- **Full chart 1990-05-20 14:30 → 庚午 · 辛巳 · 乙酉 · 癸未**, identical to Cantian AI.

Honesty (stated on-page): only the **day pillar** is exact. Year/month solar-term
boundaries are approximated by fixed dates (±1 day near a boundary). Hour uses clock time
(no longitude/true-solar correction; midnight day-boundary). Element balance counts each
of the 8 characters' **primary** element once; branch hidden stems 藏干 are not tallied.

---

## Pass 1 — first render (`52-p1-*.png`)
**Captured:** hero (desktop+mobile), four pillars, day-master + balance, reading, mobile pillars.

**Worked immediately:** the four pillars read gorgeously — 庚午/辛巳/乙酉/癸未 with correct
per-character element tints (metal grey, fire red, wood green, water blue, earth ochre);
Day Master column highlighted with a 日主 tab and red inner frame; summary strip (Day Master,
Animal 午 Horse, Polarity 陰, Day #22/60) all correct; the 五行 pentagon (gold 相生 pentagon
with flow arrows + faint dashed 相剋 star, nodes scaled by count) plus the bar readout; the
rule-generated reading was accurate ("金 Metal runs strongest… disciplines your Wood" =
金剋木). Zero console errors both widths.

**Problems found:**
- **Seal bug:** the reading's vermilion 命 seal had a stray cream box — the seal's inner
  `.sm` ("Fate") label collided with the global `.sm` summary-cell class (background+padding
  bled through).

**Changed:** renamed the seal label class `.sm → .tag`; the seal now reads "命 / FATE" cleanly.

---

## Pass 2 — edge cases & ordering (`52-p2-*.png`)
**Captured:** hour-unknown chart (`?date=2000-01-01&nohour`) + its balance/reading, mobile pillars.

**Verified:** the **hour-unknown** path renders an elegant "—" placeholder (未詳 · "hour not
set"); the 6-character balance + pentagon show 金 Metal as a correct faint zero-node; the
"absent element" reading branch fired ("金 Metal is absent… a quality to grow toward").

**Problems found:**
- Reading copy hard-coded "the eight" / "the other seven characters" even when the hour was
  unknown (only 6 characters) — a factual mismatch.
- "How this is computed" cells were ordered Year·Day·Hour·Month, not the conventional 年月日時.
- Mobile: the "日主 Day Master" tab wrapped and grazed the 乙 glyph at ≤520px.

**Changed:** made the reading count-neutral ("absent from the chart", "the rest of the chart
circles and colours"); reordered the how-cells to 年→月→日→時; on mobile the Day-Master tab
now shows just **日主** (English hidden) with a tighter inset.

---

## Pass 3 — robustness & final sweep (`52-p3-*.png`)
**Captured:** how-computed section, a third independent date (`1970-11-15 07:10`), final
hero desktop + mobile.

**Verified:** third date computes 庚戌 · 丁亥 · 己亥 · 戊辰 (Day #36/60, Day Master 己 Yin
Earth) with 木 Wood correctly absent — all cross-checkable by hand; how-computed now reads
年→月→日→時 with the honesty note intact; hero composed at both widths; seal, drop-caps,
selection, focus-visible, styled scrollbar all present; reduced-motion is guarded (JS sets
final state when RM, and CSS forces pillars/bars visible regardless). **NO_CONSOLE_ERRORS**
at 1440 and 390 on every capture.

**Result:** no outstanding problems. Computation validated against 4 known day pillars +
11 automated chart checks; UI clean and intentional at both widths.
