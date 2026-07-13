# PASSES — 07-type-clock (MERIDIEM)

Screenshot protocol: `shot.mjs` at 1440×900 (`-d`) and 390×844 (`-m`), waitMs 4500,
three fixed times via the `?t=HH:MM` override — 09:17 (day / scattered grid),
22:41 (evening / scattered grid), 05:30 (dawn / stacked left). All shots live in `passes/`.

---

## Pass 1 — `07-p1-*.png`

Console: **zero errors** at all six shots.

### Found (merciless read)

1. **Collision, every time tested:** the composition's lowest line (the small
   "in the morning / evening" caps line) lands inside the fixed furniture zone —
   overlapping the written-out date at 09:17 desktop, sitting on the skyline arc at
   05:30 mobile, and colliding with the ELSEWHERE column header at 22:41 desktop.
   Templates place lines down to y≈86–88% but the meta row starts at ~80% (desktop)
   / ~70% (mobile). Worst offender of the pass.
2. **Mobile seconds ring crowding:** at 390px the ring sits bottom-right where the
   small caps line also wants to be (22:41-m: "IN THE EVENING" nearly touching "SEC").
3. **Mobile display type undersized:** `--u` capped at 13.5vw left the words small and
   floaty inside 844px of height — big dead bands above and below the phrase.
4. **Scattered grid isn't scattered:** at both 09:17 and 22:41 the two big words both
   picked the centre column, so template 06 read as a clone of template 03
   (Centered mass). Template distinctness broken.
5. Palettes read well (paper/ink day, navy/cream evening, plum-rose dawn); moon/sun
   glyph, seconds ring, controls bar all composed. Backlink + masthead fine.

### Fixed

- Added `avoidFurniture(stage)`: after layout + fit, every line's rect is tested
  against the real rects of `.meta-left`, `.elsewhere`, `.seconds`, `.controls`,
  `.clock-head` and `.backlink`; overlapping lines are nudged up (bottom furniture)
  or down (top furniture) in pixels. Runs on every recomposition and on resize.
- Lowered every template's vertical range (y1 88→76–80) so the clamp is a safety
  net, not the layout.
- Scattered grid now forbids two `big` words from sharing a column.
- Mobile `--u` raised to `clamp(42px, 16vw, 80px)` (fitLines still shrinks any line
  that would overflow its margin).

---

## Pass 2 — `07-p2-*.png`

Extra coverage this pass: `07-p2-1403-m` (right rag on mobile — stress-tests the
seconds ring), `07-p2-0916-d` (split diagonal), `07-p2-scroll-d`
(`?scroll=.templates` mid-page state). Console: **zero errors**, all nine shots.

### Found

1. **All pass-1 collisions gone.** 09:17 now reads as a falling diagonal
   (centre / left / right); 22:41's "IN THE EVENING" cleared the ELSEWHERE column;
   05:30 mobile no longer touches the skyline arc; 14:03 mobile's right-set caps line
   was correctly nudged above the seconds ring. Scattered grid's two big words now
   take different columns — template 06 no longer impersonates template 03.
2. **Dead grey slab in the templates section (desktop):** `.tpl-grid` used
   `auto-fit minmax(300px,1fr)` → 4 columns at 1440px, so 6 cards left two empty
   grid cells rendering as a large blank `--faint` rectangle. Looked broken.
3. Mobile: the nudged caps line sat a near-touch 12px above the date words —
   legible but cramped.
4. Split diagonal hairline runs full-bleed past the inner frame — reads as a
   deliberate full-bleed rule; kept.

### Fixed

- `.tpl-grid` now explicit `repeat(3,1fr)` → 2 → 1 columns (all divisors of six:
  no empty cells at any width).
- Furniture-avoidance padding 12px → 16px.

