# 合婚 · TWO CHARTS IN CONVERSATION — Iteration Passes

A **real** 合婚 (marriage-matching) engine, cast in code and rendered as a
matchmaker's ledger. The visitor enters **two** birth dates; the two charts are
laid side by side and read for compatibility across the three classical tests —
**生肖合婚** (the zodiac branches: 六合 / 三合 vs 相冲 / 相刑 / 相害 / 相破),
**五行合婚** (the day-master elements: 相生 / 相克 / 比和, and who supplies what the
other lacks), and **纳音合婚** (the sound-element 纳音 of each birth year in tune) —
synthesized into a 0–100 score, a 上 / 中 / 下 grade, strengths, friction points, and
a **"for reflection, not a verdict"** note (no fear, no fatalism). A red thread
(紅線) runs between the two facing cards, with a jade **合** / brass **緣** / cinnabar
**冲** seal in the middle reflecting the synthesized verdict.

Fonts: **Noto Serif SC** (hanzi — the animal glyphs, seals, display) · **Cormorant
Garamond** (italic English display — the lede, animal names, score numeral) ·
**Spectral** (English serif body) · **IBM Plex Mono** (data, pinyin, labels).
Palette: warm paper `#F5F1E8` / ink, **cinnabar `#AC3E2C`** (the 囍/合 red, Person A),
**jade `#2F6D5E`** (Person B / harmony), brass rules; a red-thread + true-lover's-knot
motif and a 鸳鸯/緣 watermark.

Screenshots served over `python3 -m http.server 8939`, captured with
`assets-pipeline/shot.mjs`. `?a=YYYY-MM-DD&b=YYYY-MM-DD` forces a specific pairing.
All captures reported **NO_CONSOLE_ERRORS** at 1440 and 390; a scroll-width probe
found **no horizontal overflow** at 1440, 390, or 360 px.

---

## Computation — calibrated & verified (the accuracy that matters most)

### Day pillar (from the Julian Day Number)

```
JDN = D + ⌊(153·m+2)/5⌋ + 365·y + ⌊y/4⌋ − ⌊y/100⌋ + ⌊y/400⌋ − 32045
      (a = ⌊(14−M)/12⌋,  y = Y+4800−a,  m = M+12a−3)
day ganzhi index = (JDN + 49) mod 60      // stem = idx%10, branch = idx%12
```

**Offset = 49**, cross-checked against four independent known dates — all PASS:

| Date        | (JDN+49) mod 60 | Pillar | Expected |
|-------------|-----------------|--------|----------|
| 2000-01-01  | 54              | 戊午   | 戊午 ✓   |
| 1984-02-01  | 1               | 乙丑   | 乙丑 ✓   |
| 1990-05-20  | 21              | 乙酉   | 乙酉 ✓   |
| 2026-07-18  | 29              | 癸巳   | 癸巳 ✓   |

The day pillar — and each person's **Day Master** (day stem) — is **exact**.

### Branch (生肖) relationship tables — verified against the classics

- **六合** (secret friends, 6 pairs): 子丑→土, 寅亥→木, 卯戌→火, 辰酉→金, 巳申→水, 午未→太陽太陰.
- **三合** (trine 局): 申子辰→水, 亥卯未→木, 寅午戌→火, 巳酉丑→金 (two-of-three = 半合).
- **相冲** (6): 子午 · 丑未 · 寅申 · 卯酉 · 辰戌 · 巳亥.
- **相刑**: 子卯(无礼) · 寅巳申(无恩) · 丑戌未(恃势) · 辰午酉亥(自刑).
- **相害** (6): 子未 · 丑午 · 寅巳 · 卯辰 · 申亥 · 酉戌.
- **相破** (6): 子酉 · 卯午 · 巳申 · 寅亥 · 丑辰 · 未戌.

Priority when a pair occupies several tables: 六合 › 三合 › 冲 › 刑 › 害 › 破 (合 overrides
破; the relmap still lights every table that applies — e.g. 寅亥 shows both 六合 **and**
相破, the classic 合中带破). Spot-checks (all correct):

| Pair | Result |
|------|--------|
| 寅亥 (Tiger–Pig)   | **六合** → 木 ✓ (the brief's known-六合 pair) |
| 寅午 (Tiger–Horse) | **三合** → 火局 ✓ |
| 子午 (Rat–Horse)   | **相冲** ✓ |
| 子卯 (Rat–Rabbit)  | **相刑** ✓ |
| 子未 (Rat–Goat)    | **相害** ✓ |
| 辰辰               | **自刑** ✓ · 子子 → **比和** ✓ |

### 五行 生克 & 六十甲子纳音

- Elements: 相生 (X生gen[X]), 相克 (X克ctrl[X]), else 比和 (same). Each chart's four
  characters (year + day pillars) are tallied to surface complementary gaps.
- 纳音: 30 sound-elements over the 60-cycle, indexed `⌊ganzhi/2⌋`. Verified:
  1990 庚午 → **路旁土** (Roadside Earth); 1992 壬申 → **剑锋金** (Sword-Edge Metal). ✓

### Anchor pairings (verified)

- **Forced / screenshot pair `?a=1990-05-20&b=1992-08-14`** → A 午 Horse (乙酉 day, DM Wood,
  纳音 路旁土) · B 申 Monkey (壬戌 day, DM Water, 纳音 剑锋金). Zodiac **平** (neutral); day-masters
  **水生木** (相生); 纳音 **土生金** (相生); element mixes **mutually complementary** (A lacks
  土/水 which B carries; B lacks 木/火 which A carries). Score **82 → 上**, seal **合** (jade).
- **Default (no-param) pair** 1995-06-18 Pig · 1998-05-05 Tiger → **寅亥六合 木**, DM 相生,
  纳音 相生. Score **100 → 上**, seal **合** (jade), full jade ring.
- **Clash demo** 1990-06-15 · 1996-07-07 → 午 Horse vs 子 Rat = **子午相冲**, DM 相克, 纳音 相克.
  Score **34 → 下**, seal **冲** (cinnabar) — rendered with the honest "asks for care" framing.

Honesty (stated on-page): only the **day pillar** is exact; the year branch turns at
立春, approximated by a fixed **Feb 4** (near it the animal may shift). Birth **time** is
recorded but changes none of the three readings (all read the date-fixed year & day).
The **score** is one studio's weighting (生肖 45 · 五行 30 · 纳音 25) — a heuristic for
reflection, not an oracle.

---

## Pass 1 — first render (`64-p1-*.png`)
**Captured:** hero (desktop+mobile), the two facing charts + verdict banner, 五行合婚,
纳音合婚, 合斷 synthesis; plus a **clash** pair and the **mobile stacked** charts.

**Worked immediately:** the two-card "facing" layout with the red thread + verdict seal
read beautifully; the 午/申 giant animal glyphs, day-master + 纳音 stat rows, the score
gauge (82, count-up + jade arc), the 五行 complementarity ("B's Water feeds A's Wood",
"← partner" tags on the element bars), the 纳音 plates with poetic English glosses, and
the synthesis's strength/friction cards + reflection note. Zero console errors both widths;
the clash pair correctly showed a cinnabar 冲 seal, grade 下, and the non-fatalist copy.

**Problems found:**
- **Seal mismatch:** the central seal reflected only the *zodiac* relationship (平 → brass
  緣), while the overall verdict was 上 (jade gauge) — two different signals in one view.
- Hero kicker `<em>` ("Compatibility · 生肖 · 五行 · 纳音") wrapped to a ragged 3 lines.
- The 生肖-section centre glyph used a generic character for 刑/害/破/平 (all collapsed to
  冲/緣), not the precise relationship glyph.

**Changed:** the seal now reflects the **synthesized verdict** — 合 (jade, 上) / 緣 (brass,
中) / 冲 (cinnabar, 下) — with the specific zodiac bond kept in the small tag beneath it;
shortened the kicker to "Compatibility · 合婚"; made the 生肖-section centre glyph precise
(刑 · 害 · 破 · 平 · 合 · 和).

---

## Pass 2 — verifying the fixes & the two anchor cases (`64-p2-*.png`)
**Captured:** the 生肖合婚 section for the **neutral** pair; the **default 六合** pair's charts
+ 生肖 section; the default hero.

**Verified:** the neutral pair's centre glyph now reads **平** (brass) matching its "平 ·
Neutral" label; the default 六合 pair renders a **jade 合** seal ("六合 · Secret Friends"), a
**full jade ring at 100/100**, and its relmap lights **both 六合 and 相破** (寅亥, correctly —
合中带破) while the prose leads with the 六合; the hero kicker now sits clean on two short
lines. No new problems.

---

## Pass 3 — mobile sweep & final robustness (`64-p3-*.png`)
**Captured:** mobile 五行合婚 and 合斷 synthesis; desktop 推算之法 (how-computed) + footer.
Ran a scroll-width probe at 1440 / 390 / 360 px.

**Verified:** on mobile the two charts stack with a **vertical** red thread through the seal;
the 五行 header (木/生/水) and the two element-mix columns stack; the synthesis strength /
friction / reflection cards stack; **no horizontal overflow** at any width (`scrollWidth ==
clientWidth`); the how-computed grid + honesty note render, and the footer + fixed back-link
both read **XAVIER FABLE ×65**. `::selection`, styled scrollbar, `:focus-visible`, grain,
vignette, and the 緣 watermark all present; every animation (card entrance, gauge fill +
count-up, element bars, thread draw) is guarded behind `prefers-reduced-motion`, and there
is **no persistent rAF loop** (the page is static after each cast). **NO_CONSOLE_ERRORS**
on every capture.

**Result:** no outstanding problems. The three classical 合婚 tests are computed from
verified tables (day pillar exact; branch relations, 五行 生克, and 纳音 all cross-checked),
and the UI is intentional and clean at both widths, in harmony and in clash.
