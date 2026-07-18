# 54-kau-cim — iteration passes

**求籤 · FORTUNE STICKS** — a temple Kau Cim oracle you physically shake. Hold a question,
press-and-hold + jiggle the mouse (or shake the phone via DeviceMotion), agitate the bamboo
籤筒 until one numbered stick works free and falls, cast the moon blocks (筊杯 → 聖筊, they
agree), and read the drawn 籤 poem: number, fortune level, a 4-line classical verse in hanzi +
pinyin + English, and the five-category 解籤 interpretation.

Served at `http://localhost:8929/sites/54-kau-cim/` · shot via `assets-pipeline/shot.mjs`.
**Zero console errors** on every shot, both widths (1440×900 and 390×844).

Screenshot / state hooks implemented:
- `?stick=N` — force a specific drawn fortune (scrolls to the poem plaque).
- `?revealed=1&seed=X` — force a seeded drawn fortune.
- `?shaking=1` — frozen mid-agitation frame (sticks jostled, chosen stick half-risen).
- `?scroll=<section-id>` — jump to a section (rite / oracle / canon) for mid-page shots.
- `prefers-reduced-motion` → calm: a drawn stick is shown with no jitter, blocks already agreed.

Content: 48 original fortune poems composed in the Guan Yin / Wong Tai Sin oracle grammar
(no real temple's texts reproduced) in `data.js`; a seeded mulberry32 RNG picks the stick.

## Pass 1 — first full render (54-p1-*.png)

Found (read desktop idle / reveal / shaking + mobile idle / reveal):
- **Reveal not framed for the screenshot**: `?stick=28` left the page at the top (altar + moon
  blocks) with the poem plaque sliding in only at the very bottom edge — the actual deliverable
  (the fortune poem) was below the fold.
- **Desktop idle dead zone**: a large empty band sat between the subtitle and the cylinder;
  the stage was `flex:1` so the cylinder floated low while the title clung to the top.
- **Wood-grain seam**: the 400px turbulence tile repeated, leaving a visible vertical band
  right of centre.
- The cylinder-of-sticks, the shaking snapshot, and both mobile frames already read well
  (tactile bamboo bundle, one stick clearly rising during the shake).

Changed:
- Forced-reveal states now `scrollIntoView(#reveal)` so the carved plaque is the frame.
- `#altar` → `justify-content:center` with a controlled `gap`; stage no longer `flex:1`;
  balanced top/bottom breathing room around the title + cylinder + button group.
- Wood grain: single 1700px `no-repeat` centred tile, opacity .34, finer frequency — seam gone.
- Brightened the "FORTUNE STICKS" kicker for legibility.

## Pass 2 — recheck + poem-order bug (54-p2-*.png)

Found:
- **Classical reading order was reversed**: the four vertical hanzi columns were laid out
  left-to-right, so line 1 sat on the far left. Vertical temple verse reads **right-to-left** —
  line 1 must be the right-most column. (Pinyin and English stanzas were already correct.)
- Idle composition and the `?stick=5` GREAT FORTUNE / `?stick=28` GOOD FORTUNE plaques
  otherwise composed cleanly; level badges (上上/上吉/中/下) legible and distinct.

Changed:
- `.poem-cn` → `flex-direction:row-reverse` so column 1 (line 1) renders right-most; verified
  第二十八籤 now reads 月出東山… (right) → …表裏清 (left).
- Added the `?scroll=` hook to review the lower sections.

## Pass 3 — full-page + interaction + a11y states (54-p3-*.png)

Found / verified:
- Corrected right-to-left poem confirmed at both widths (`54-p3-desktop-reveal`, mobile).
- **The Rite** (問籤之禮, four 一二三四 brush steps), **On the Oracle** prose, and the
  **Canon** rack of 48 bamboo sticks (numbers + 上上/上吉/中/下, great-fortune sticks tinted
  brighter) all compose well; canon reflows 15→6 per row on mobile.
- Full tall reveal (`?stick=46`) shows the whole flow — plaque → pinyin → English quatrain →
  解籤 grid (運程/財/姻緣/健康/事業 · FORTUNE/WEALTH/LOVE/HEALTH/CAREER, 5-up desktop,
  2-up + full-width 5th on mobile) → ASK AGAIN.
- **Drove the real ritual** headlessly (press-hold + 90 mouse jiggles → release): sticks
  agitate, one falls, moon blocks cast, reveal appears — `drawn:true, revealShown:true,
  STICK NO.19`, no console errors.
- **Reduced-motion** emulated: shows a calm drawn stick (fallen + blocks agreed, no jitter),
  no errors.

Changed:
- No further layout changes required — design held up. Left the frozen `?shaking=1` snapshot
  and `?scroll=` hooks in place for the record.

## Result
Fonts — **Ma Shan Zheng** (求籤 brush title, Chinese numerals, section heads) · **Noto Serif SC**
(poem hanzi, interpretation labels) · **Cormorant Garamond** (pinyin + English rendering) ·
**Space Grotesk** (UI/labels). Palette: vermillion `#b22222` + gold `#c9a24b` on dark wood with
incense haze, a hanging-lantern glow, and a rising incense wisp.
