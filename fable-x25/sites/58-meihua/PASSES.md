# 58 · 梅花易數 PLUM BLOSSOM — iteration passes

**Concept.** The plum-blossom number oracle: anything becomes a hexagram. Four sources — 此刻 the moment (year-branch/month/day/hour), 兩數 two numbers, 一字 a word (stroke counts), 一觸 one spontaneous tap. Real 梅花易數 logic: 先天八卦 numbers, upper trigram = first number mod 8 (0→坤/8), lower = second mod 8, moving line = sum mod 6 (0→6). Builds 本卦 (main), 互卦 (nuclear, lines 2-3-4 & 3-4-5), 變卦 (flip the moving line). Reads 體/用 (self / situation — the trigram without the moving line is 體) and their 五行 生克 relationship into a one-glance verdict, plus trigram imagery.

**Fonts.** Noto Serif SC (hanzi/trigrams) · Cormorant Garamond (display italic English) · Spectral (serif body) · IBM Plex Mono (numbers / UI labels).

**Palette.** Warm paper #F5F1E8 / ink #22201B · jade #2E6B5E · cinnabar #C1352A · brass #A8813C. Plum-blossom (梅) motif in cinnabar; five-element wheel colours 木 jade / 火 cinnabar / 土 brass / 金 bronze-grey / 水 ink-teal.

## Verified worked example — the classic 觀梅 (Shao Yong observing plum blossoms)
Cast 辰年(5) · 十二月(12) · 十七日(17) · 申時(9):
- 上卦 = (5+12+17) = 34 → 34 mod 8 = **2 → 兌** (Lake, 金)
- 下卦 = 34+9 = 43 → 43 mod 8 = **3 → 離** (Fire, 火)
- 動爻 = 43 mod 6 = **1** (bottom line)
- 本卦 = 上兌下離 = **澤火革 Gé / Revolution (#49)**
- 互卦 (lines 2-3-4 = 巽, 3-4-5 = 乾) = **天風姤 Gòu (#44)**
- 變卦 (flip line 1) = 上兌下艮 = **澤山咸 Xián (#31)**
- 動爻 in line 1 → lower 離 is 用, upper 兌 is 體. 體 兌 金 · 用 離 火 → 火克金 → **用克體 · 凶** (the situation overcomes the self — the flowers will break). Matches the classic outcome.

Logic reproduced in a Node prototype and again inside the page's `cast()`; the 64-hexagram (upper-lower) map is complete and unique (64/64 combinations).

## Screenshot forcing
`?a=7&b=3` forces a two-number cast; `?time=1` forces a moment cast; `?word=梅花` a word cast; add `&noscroll=1` to keep the viewport at the hero. Served over local HTTP on **:8933**.

---

## Pass 1
Screenshots: hero (1440 + 390), two-number reading (賁 Grace → 解 Deliverance → 離 The Clinging, 體生用 Draining), full reading with five-element wheel, trigrams section. **Zero console errors** at both widths.

**Found**
- Scroll cue ("Read" + line) at the hero bottom collided with the CAST button — the full-height hero pushed the button onto the cue.
- On 390px the diagonal plum branch crossed behind the kicker and title, crowding the type.

**Changed**
- Removed the scroll-cue element entirely (JS references already null-guarded); the CAST button anchors the hero cleanly.
- Shrank + pushed the hero motif into the top-right corner on ≤860 and ≤520 (lower opacity, added hero top padding on mobile) so it reads as a flourish, not over the type.

**Confirmed working:** all logic correct (本卦/互卦/變卦, 體/用, 五行 生克), the five-element wheel (jade ring = 體, cinnabar ring = 用, 生/克 arrow), brush-stroke line-draw animation, trigram cards, mobile stacking.

## Pass 2
Screenshots: hero desktop + mobile (motif fixed), moment cast on mobile (澤火革, 體克用 "Favorable, with effort"), method section.

**Found**
- Nothing broken. Composition strong across the board. Method cards, code chips (`mod 8` / `mod 6`), and the 動爻/體用/本·互·變 hanzi labels all read cleanly.
- Confirmed the mobile motif now sits as a top-right corner flourish clear of the title, and the desktop CAST button no longer collides with anything.

**Changed**
- No further layout changes needed; verified the moment source decomposes correctly (午年=7 · 7月 · 20日 · 子時=1) and casts a live, time-dependent hexagram.

## Pass 3
Screenshots: forced-adverse reading `?a=10&b=3`, ti/yong explainer + origin, word cast `?word=緣` (mobile).

**Found**
- All three verdict tones render with the right accent colour: **jade** 體用比和 (word 緣 → 謙 Modesty), **brass** 體生用/體克用, **cinnabar** 用克體.
- `?a=10&b=3` reproduces the canonical 觀梅 reading exactly — 本卦 澤火革, 互卦 天風姤, 變卦 澤山咸, 用克體 · 凶, imagery "the lake set alight". The five-element wheel draws the 火→金 克 arrow in cinnabar.
- One screenshot pair first reported `NAV: Navigation timeout` — this was the single-threaded `python -m http.server` queueing rapid concurrent requests, **not** a page/JS error. Re-ran against a threaded server → **NO_CONSOLE_ERRORS**.

**Changed**
- Switched the local screenshot server to a threaded handler to avoid the navigation-idle timeouts. No code changes to the site were required in pass 3 — the page is correct and stable.

**Final state:** faithful 梅花易數 logic (mod-8 trigrams, mod-6 moving line, 互卦, 變卦, 體用 + 五行 生克), four sources, brush-stroke line animation, five-element wheel, bilingual copy, reduced-motion + hidden-tab guards, styled scrollbars/selection/focus, zero console errors at 1440×900 and 390×844.
