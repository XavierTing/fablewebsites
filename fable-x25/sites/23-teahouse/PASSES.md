# KŌCHA-AN 更茶庵 — Iteration Passes

Concept: Japanese minimalism where restraint, *ma* (negative space) and micro-motion
are the showcase. Fonts: Shippori Mincho (serif display/kanji) + Zen Kaku Gothic New
(light sans). Palette: warm paper `#f5f2ea`, ink `#2b2926`, tea green `#6a7a5a`.

Screenshots for each pass live in `passes/` (1440×900 desktop, 390×844 mobile).

---

## Pass 1 — full read at both widths

**Reviewed:** entrance, water (ripple), seasonal menu, room (ikebana), the way, visit (CSS map), footer.

**Working well / verified:**
- Enso self-draws (3s ease) and rests with the correct open gap; steam wisp is gentle.
- Water ripple loop is slow (7s) and calm; only runs while visible + tab shown.
- Menu hover washes, tea-list hierarchy, serif manifesto, and the CSS line-map all read as intended.
- Whitespace rhythm (32vh section padding, fade+rise reveals) reads as luxury emptiness.
- Zero console errors at both widths.

**Problems found:**
1. **Concept miss — the kanji name rendered horizontally.** `.name-vert` was a
   `writing-mode:vertical-rl` *flex* container; the flex items lost their own vertical
   flow, so 更茶庵 laid out as one horizontal line (measured 192×142, wider than tall)
   instead of the intended vertical tea-house sign. The romaji ran vertical but the
   headline kanji did not — the opposite of the brief's "vertical kanji name."
2. The vertical romaji carried the full tagline ("…A TEA HOUSE IN THE MOUNTAINS"),
   making the column very tall — a latent collision risk with the centered invite line.

---

## Pass 2 — fix the vertical name (entrance)

**Changed:**
- Moved `writing-mode:vertical-rl` off the flex *parent* and onto the child spans
  (`text-orientation:upright` on kanji, `mixed` on romaji); parent is now a normal
  horizontal flex. 更茶庵 now stacks vertically as a proper sign beside the enso.
- Tightened kanji letter-spacing `.5em → .32em` for a cleaner column.
- Shortened the vertical romaji to just `KŌCHA·AN` (the tagline lives in the title/meta),
  removing the invite-line collision and the cramped two-column wrap on mobile.

**Verified (23-p2-entrance-d2 / -m2):** enso + vertical kanji sign + thin romaji column,
balanced and centered, no overlaps, clean at 390px. Zero console errors.

---

## Pass 3 — rhythm polish + verification

**Problem found:** in the seasonal menu each `.tea` row was its own grid with an `auto`
first column, so the differing kanji widths (抹茶=63.8px, ほうじ茶=127.7px, 玄米茶=95.8px)
made the note/romaji columns start at a **different x per row** — an order-breaking
misalignment.

**Changed:** fixed the desktop kanji track to `8.25rem` (fits the widest, ほうじ茶) so
every note and romaji label aligns to one edge. Mobile keeps its stacked override.

**Verified:**
- 23-p3-menu-d: all note columns now share one left edge; calm, orderly.
- 23-p3-reduced-entrance: with `prefers-reduced-motion: reduce`, enso path rests at
  `stroke-dashoffset:64px` (fully drawn, no animation), invite + ENTER visible, steam
  static — the page reads correctly with zero motion. 0 errors.
- Favicon (🍵 inline SVG), `FABLE ×25` back-link to `/`, and zero console errors confirmed
  at 1440×900 and 390×844.

Large display type remains light throughout (Shippori Mincho 400 fine-stroke serif +
Zen Kaku Gothic 300) — never bold.
