# 57 · 六爻 · SIX LINES — iteration passes

Screenshot tool: `node assets-pipeline/shot.mjs <url> <out> <w> <h> <waitMs>`
Served locally over HTTP on `:8932` (headless file:// blocks history.replaceState / clipboard, so screenshots use the URL form).
Shots live in `passes/`. Widths tested: 1440×900 and 390×844. Reduced-motion via puppeteer `emulateMediaFeatures`.

Fonts: **Noto Serif SC** (900/700/600/500/400 — the 卦 glyphs, kin, branches, seals), **Spectral** (italic display + body prose), **IBM Plex Mono** (labels, kickers, table chrome).

---

## Pass 1 — initial build state (shots `57-p1-*`)

**Reviewed:** `57-p1-cast-1440.png`, `57-p1-board-1440.png`, `57-p1-board-390.png`.

- Board (卦盤) reads beautifully at both widths: all six columns present — 六神 / 六親 / 干支+五行 (wu-xing coloured) / 卦爻 glyph with ○× moving marks / 世應 / 變爻. 用神 rows tint jade. 本卦→變卦 figures + note render. Verdict card (大吉 tier, 用神 chip, signed reasoning list, 應期 timing) all correct.
- **Bug found (interrupted edit):** the hero markup wraps the coins + hexagram-builder in `<div class="cast-row">`, but **no `.cast-row` CSS rule existed** — the builder stalled mid-edit. With `.cast-row` defaulting to `display:block`, the empty hexagram frame stacked *below* the coins and reserved ~150px of vertical space, pushing the primary **"Toss the coins" CTA below the 900px fold** on first view. The empty six-line frame was also invisible (`.bl{opacity:0}`), so the reserved space read as a dead zone.

## Pass 2 — repair the interrupted edit (shots `57-p2-*`)

**Changed:**
- Added `.cast-row{display:flex;align-items:center;justify-content:center;gap:clamp(26px,4.8vw,58px)}` — coins now sit **beside** the assembling hexagram as one casting tableau, cutting the vertical footprint (~165px row vs ~250px stacked). The "Toss the coins" CTA, toss-counter and hint now all clear the fold at 1440×900.
- Reworked the empty hexagram frame so it shows six **faint dashed line-slots** (moved the entrance animation off `.bl` onto `.bl .seg-bar`; `.ghost` now visible at .7 opacity; `buildHexFrame` injects only the ghost, no stray solid bar). Reads as "an empty frame waiting to be filled" rather than blank space.
- Added mobile rule: `@media(max-width:560px){.cast-row{flex-direction:column}}` — coins over frame, CTA stays visible at 390×844.

**Verified:** `57-p2-cast-1440` (CTA above fold ✓), `57-p2-cast-390` (stacks ✓), `57-p2-board-1440` / `57-p2-board-390` (board unaffected, still perfect). NO_CONSOLE_ERRORS on all four.

## Pass 3 — verification & hardening (shots `57-p3-*`)

**Checked:**
- **Reduced motion** (`57-p3-reduced-cast-1440`, `57-p3-reduced-board-1440`): coins render static & visible, hexagram lines appear instantly without the toss animation, board fully assembled. Layout identical to motion build. NO_CONSOLE_ERRORS.
- **Zero console errors** confirmed at 1440 and 390, motion and reduced-motion, cast and completed-board states.
- **Engine coverage, second case** (`57-p3-board-static-1440`, `?lines=787878&type=general`): produces 既濟 (坎宮 3rd World), all six lines still → correct "no transformation" note, general 用神 resolves to the 世-line kin (兄弟), verdict 平/Mixed. 納甲 卯丑亥申戌子 and 六親 all historically correct.
- Structural: CSS braces balanced (254/254), single `<script>`, valid `</html>`; title + meta description + SVG favicon present; backlink `XAVIER FABLE ×65 → /`; no continuous rAF loop (cursor rAF self-terminates and cancels on `visibilitychange`, progress bar is scroll-gated).

**Merciless critique remaining:** the coins/frame tableau is centred as a unit, so coins read slightly left-of-centre with the frame right-of-centre — judged deliberate ("cast → fill the frame"), not corrected to avoid regressing the reclaimed fold space. No blocking issues.

---

## Known-case verification (六爻 correctness)

**Case A — `?lines=776896&type=career`** (bottom→top line values 7,7,6,8,9,6):
- 本卦 = **節 (水澤節)** — lower 兌, upper 坎. Palace **坎宮 一世卦**, 世 on line 1, 應 on line 4. ✓ (historically correct)
- 納甲: 巳(火)·卯(木)·丑(土)·申(金)·戌(土)·子(水) — matches the classical 水澤節 dressing. ✓
- 六親 (palace element 水 = "self"): 妻財·子孫·官鬼·父母·官鬼·兄弟. ✓
- 3 moving lines (3,5,6) → 變卦 **大畜 (山天大畜)**. ✓
- type=career → 用神 官鬼; both 官鬼 lines highlighted; verdict computed from presence + day strength + movement (化進神) + world relation. ✓

**Case B — `?lines=787878&type=general`** (7,8,7,8,7,8, no moving lines):
- 本卦 = **既濟 (水火既濟)** — 坎宮三世卦, 世 line 3 / 應 line 6, no 變卦. 納甲 卯丑亥申戌子, 六親 子孫/官鬼/兄弟(世)/父母/官鬼/兄弟(應) all correct; general 用神 = 世-line kin 兄弟. ✓

Engine cross-checks its own build against 乾為天 / 天火同人 / 節 in-code; verified by hand above for 節 and 既濟.
