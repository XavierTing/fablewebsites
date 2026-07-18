# 53-iching — iteration passes

**易經 · THE BOOK OF CHANGES — cast the coins.** An authentic I Ching (Zhōu Yì) oracle:
hold a question, toss three bronze coins six times, watch the hexagram build bottom-up, then
read a full divination — judgment (卦辭), image (象辭), changing-line texts (爻辭), and the
present→future transformation across all 64 King Wen hexagrams.

Served at `http://localhost:8928/sites/53-iching/` · shot via `assets-pipeline/shot.mjs` ·
zero console errors on every shot and both widths.

**Screenshot / share params implemented (deterministic, no animation):**
- `?lines=NNNNNN` — six digits, each 6/7/8/9 (bottom→top), renders a complete reading.
- `?hex=N[&move=k]` — build hexagram N (1–64) with line k (1–6) moving; default line 5.
  `?hex=1` → 乾 The Creative with 九五 moving → transforms into 14 大有.
- `?cast=DDDD` — 1–5 digits, a partial mid-ritual state (hexagram half-built) for the casting shot.
- `?q=...` — pre-fills the question, echoed in the reading header. "Save this reading" writes
  `?lines=…&q=…` to the URL and copies it.

Data integrity verified programmatically: all 64 hexagrams present, 64 **unique** trigram keys,
King Wen number computed from the 6-bit lower+upper lookup (`?hex=1` line-5-moving → 14 confirmed).

## Pass 1 — first full render (53-p1-*.png)

Found:
- **Altar taller than the viewport.** At 1440×900 the primary **Cast** button, the Coins/Yarrow
  toggle and the hint all fell below the fold — the hero's CTA wasn't visible without scrolling.
- **Scroll-cue collision.** The absolutely-positioned "The Sixty-Four" scroll cue (bottom:26px)
  overlapped the "Your Question" label and the question field on both the initial altar and the
  completed-at-altar state (also on mobile).
- `?hex=1` opened the reading but did not bring it into view, so the reading-panel screenshot
  captured the altar instead of the judgment/changing-line/transform block.

Changed:
- Tightened the whole hero rhythm: reduced `#oracle` padding, kicker margin, title clamp
  (132→108px), title-en/lede sizes, `.stage`/`.coins`/`.hexbuild` gaps and heights, and the
  question/controls margins — the full ritual (title → coins → frame → question → **Cast** →
  toggle → hint) now composes inside 1440×900 and 390×844.
- Removed the scroll cue entirely (the top progress bar already serves as the progress indicator);
  cue references reduced to a safe no-op.
- `loadFromParams` now hides the cue, and scrolls the reading panel into view for full readings
  (skippable with `?view=altar`); added `?cast=` for a partial mid-cast screenshot state.

## Pass 2 — reading states, responsive + interactive flow (53-p2-*.png)

Found / verified:
- **Single / multiple / no changing lines all correct.** `?hex=1` (one moving line → 14 大有),
  `?lines=796878` (60 節 → **two** changing lines 九二/六三 → 63 既濟), and `?lines=787878`
  (30 離, **no** changing lines → the graceful "all six lines are still" message) each render the
  right figure, trigram pair, line labels (九/六 + position), moving-line texts, and transform.
- **Interactive cast flow test** (Puppeteer: type question → click Cast ×6): completes end-to-end,
  reading opens with 6 lines filled, hexagram identified (random casts → 29 坎 / 44 姤 in the two
  runs), share URL written. **Zero console errors.**
- **Reduced-motion path** (emulated `prefers-reduced-motion: reduce`): coins land without the toss
  animation, lines appear without the reveal keyframe, casting still completes and the reading is
  fully legible (44 姤 with 九二 moving). **Zero console errors.**
- Reading "Save this reading / Ask again" actions were too dim (near-invisible paper-faint).

Changed:
- Brightened the reading actions (gold-dim with a hairline underline, gold-bright on hover).

## Pass 3 — final verification (53-p3-*.png)

Found:
- Altar (1440 + 390): full ritual composed inside the fold, bagua ring + candle glow + coins read
  as an altar; no collisions. No issues.
- Reading (1440 + 390): hexagram figure, number, 乾 Qián / The Creative, Heaven-over-Heaven trigram
  pair, 卦辭 judgment + 象辭 image, changing line, present→future transform — clean hierarchy,
  correct data, comfortable rhythm. No issues.
- The Sixty-Four grid: all 64 figures correct in King Wen order (spot-checked 11 泰, 12 否,
  29 坎, 63 既濟 alternating); hover lift + tap-to-read-judgment works. No issues.
- Eight Trigrams + Method + footer: elegant, legible, on-concept. No issues.
- Zero console errors across every shot at both widths. Pass 3 clean — stopping here.

## Accessibility / motion / performance notes
- `prefers-reduced-motion`: coin toss + line-reveal + candle flicker + bagua rotation all disabled;
  the ritual still works, just instant. Verified with an emulated reduced-motion cast.
- Only two rAF users: the custom cursor (fine pointers only; self-terminates at rest and cancels on
  tab hide) and a throttled scroll-progress bar. Coin tosses use the Web Animations API (one-shot),
  everything else is CSS — no persistent rAF loop, nothing to pause but the cursor (which does).
- No CDN JS (pure vanilla) → no external-script console noise; fonts via Google Fonts; favicon is an
  inline SVG data-URI (☯) so there is no favicon 404. No `og:image` referenced → no image 404s.
- `:focus-visible`, styled scrollbar, `::selection`, grain + vignette + candle vignette, custom
  cursor — all themed to the aged-bronze-on-ink palette.
