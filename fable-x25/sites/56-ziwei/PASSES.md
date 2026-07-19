# 紫微斗數 · PURPLE STAR — Iteration Passes

A **real** Zǐwēi Dǒushù (紫微斗数) engine, cast in code and drawn as a fortune-master's
parchment chart. The visitor enters a birth date + hour (+ gender for the 大限 direction);
the site converts the Gregorian date to the Chinese **lunar** calendar, places 命宮 &
身宮 from the lunar month + birth hour, derives the **五行局** (Five-Element Class) from the
Life Palace's stem-branch nà-yīn, seats **紫微** (the Purple/Emperor star) from the Class +
lunar day, and places all **fourteen major stars** — the 紫微系 (six) and 天府系 (eight) —
by their fixed offsets, plus 左輔右弼文昌文曲 and the year-stem 四化 (祿權科忌). The classic
**twelve-palace grid** (a 4×4 board around a centre 命盤 panel) renders the whole chart;
tapping a palace lights it, marks its 三方四正, and reads its stars.

Fonts: **Noto Serif SC** (palace / star hanzi + display) · **Spectral** (English serif body
& lede, italic accents) · **IBM Plex Mono** (UI labels, pinyin, data). Palette: aged paper
`#F5F1E8`, ink `#22252E`, jade `#2F6D5E`, cinnabar `#AC3E2C`, brass `#9A7A34`, hairline rules.

Served over `python3 -m http.server 8931`, captured with `assets-pipeline/shot.mjs`.
`?date=YYYY-MM-DD&time=HH:MM&sex=m|f` forces a computed chart; `&sel=<0–11>` preselects a
palace (screenshot hook). All captures reported **NO_CONSOLE_ERRORS** at 1440 and 390 widths.

---

## Verification against known rules & a known chart (the accuracy that matters most)

**Lunar conversion** — a bundled month-length table (1900–2100, base 1900-01-31 = 农历
正月初一). Cross-checked against six Chinese New Year dates (all resolve to 正月初一,
non-leap): 1990-01-27, 2000-02-05, 2020-01-25, 2024-02-10, 2026-02-17, 2023-01-22. Leap
handling verified on 2023 闰二月 (2023-03-22 → 闰2月1日, 2023-04-19 → 闰2月29日,
2023-04-20 → 3月1日). Spot: 1990-05-20 → 农历四月廿六 (independently known).

**紫微 placement** — via the classical 起紫微訣 (day ÷ 五行局, adjusted by even/odd remainder).
Day-1 positions per Class all match the mnemonic: 水二局→丑, 木三局→辰, 金四局→亥,
土五局→午, 火六局→酉. **天府** = mirror across the 寅–申 axis (mod(4−紫微)), full table checked.

**Full-chart check — 1990-05-20 14:30 (未時), female:**
農曆庚午年四月廿六 → 命宮 **丙戌** → 納音 屋上土 → **土五局** → 紫微 in **亥**. The fourteen
main stars fall into their canonical twin-branch pairs — 機梁 (戌), 陽巨 (申), 武貪 (未),
同陰 (午), 廉破 (卯), 紫殺 (亥) — and 殺·破·狼 (亥·卯·未) form a perfect 三方 trine. 庚-year
四化 (太陽祿 · 武曲權 · 太陰科 · 天同忌) land on the right stars. This is a self-consistent,
recognised chart structure. A second chart (1984-06-15 12:00 male, 甲子/水二局/紫微在酉)
reverses to **順行** 大限 and places all 甲-year 四化 (廉貞祿·破軍權·武曲科·太陽忌) correctly —
confirming gender flips the decade direction.

**Honesty (stated on-page):** lunar conversion, the twelve palaces, the Five-Element Class,
and all fourteen major stars + 左輔右弼文昌文曲 + the four 四化 are computed faithfully. What a
full reading adds — the 100+ minor stars 雜曜, each star's brightness 廟旺利陷, the flowing
yearly/monthly charts — is **summarised, not exhaustively drawn**. The lunar year turns at
正月初一 (not 立春); a leap month is read as its base month; the hour uses clock time without
longitude correction; where schools differ (庚-year 四化) one common table is used.

---

## Pass 1 — first render (`56-p1-*.png`)
**Captured:** hero (desktop + mobile), the twelve-palace chart, the selected-palace detail.

**Worked immediately:** the 4×4 grid read gorgeously — each palace with its branch, palace
name (bilingual), stem-branch 干支, 大限 age range, its stars (main bold ink, aux muted jade),
四化 superscript tags (祿 jade / 權 brass / 科 slate / 忌 cinnabar), and the dark centre 命盤
panel (solar + lunar date, 五行局, 命宮/身宮, 命主/身主, 生年四化, 大限 direction). Default
selection lit 命宮 with its 三方四正 (opposite 遷移 marked 對, trines 財帛 & 官祿 dashed). The
constellation motif, drop-in stagger, and the detail read were all correct. Zero console errors.

**Problem found:** on the Life Palace the corner **命 badge overlapped the first star** (天機) —
the absolutely-positioned life-badge and the star text collided at the top-left.

**Changed:** moved the 命 / 身 markers out of absolute corners into a small `.pbadges` flex
row above `.stars` (rendered only when a palace is 命/身), so they never overlap star names;
restyled the life marker as a cinnabar pill reading 命宮, the body marker as a cinnabar 身 disc.

---

## Pass 2 — the badge fix & the mobile reflow (`56-p2-*.png`)
**Captured:** desktop chart (badge fix), full mobile stacked chart.

**Verified:** the 命宮 pill now sits cleanly above 天機/天梁; the 身 disc on the (empty) 福德
palace reads clearly. **Mobile:** the 4×4 grid reflows to a single stacked column — the centre
命盤 becomes a card at the top (order:-1), then the twelve palaces stack **in palace order**
(命→兄弟→夫妻→…→父母) as full-width rows, each with name + 大限 on the left and its stars on
the right. Fully legible at 390px; the 三方四正 dashed marks are hidden on mobile to avoid clutter.

**Problem found:** none in the layout. The screenshot tool intermittently threw a *navigation*
timeout on very tall mobile viewports (font connections not reaching network-idle) — not a page
error; every successful load reported NO_CONSOLE_ERRORS. Re-shooting at a normal height cleared it.

**Changed:** nothing further needed; confirmed the fix and the reflow hold.

---

## Pass 3 — a second chart, an empty room, and the honesty section (`56-p3-*.png`)
**Captured:** an alternate chart (1984-06-15 12:00 male), an **empty-palace** read
(`?sel=2` → 官祿 空宮), the default example at 1440×900 & 390×844, and the "how computed" +
footer.

**Verified:**
- The alternate chart computes 农历甲子年五月十六 → 水二局 → 命宮丙子 → 紫微在酉, with **順行**
  (forward) 大限 and every palace stem (五虎遁) and all four 甲-year 四化 placed correctly — the
  mirror of the female example, proving the gender parameter flips the 大限 direction.
- The **empty-palace** logic reads correctly: 官祿 空宮 "borrows the light of its opposite
  palace 夫妻, where 太陽、巨門 sit" — the classical 空宮借對宮 rule, generated by code.
- The "推盤之法" grid (six numbered steps ①–⑥) and the scoped honesty note render cleanly;
  footer, scroll-progress bar, styled scrollbar, ::selection, :focus-visible, reduced-motion
  guards (CSS forces palaces visible + kills the twinkle/transitions; JS sets final state when
  RM) are all present.

**Result:** no outstanding problems. Computation verified against six lunar-new-year dates, a
leap-month boundary, the 紫微/天府 mnemonics, and two full charts (both genders/directions,
main-star pairs, 四化, 大限). UI is clean and intentional at both widths; **NO_CONSOLE_ERRORS**
on every capture at 1440 and 390.
