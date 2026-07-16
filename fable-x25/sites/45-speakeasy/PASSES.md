# 45-speakeasy — THE BRASS OWL — iteration passes

Served at `http://localhost:8920/sites/45-speakeasy/` · shots via `assets-pipeline/shot.mjs` + `scrollshot.mjs`.
Zero console errors on every shot, both widths. Screenshot params implemented:
`?entered=1` skips the door ritual (used for all interior shots); `prefers-reduced-motion` pre-opens
the door and disables smoke/flicker. Interactive flows (door knock, quiz) verified with a headless
puppeteer flow script (not just static shots).

Fonts: **Playfair Display** (deco/serif display) + **Cormorant Garamond** (serif body/menu) + **Space Grotesk** (UI/labels).

## Pass 1 — first full render (45-p1-*.png)

Screened: entrance (door), hero, menu (both rows), bartender quiz, room, mobile.

Found:
- **Owl knocker read as a smiley, not an owl.** The "chest hint" arc under the beak plus the upward
  brow arcs made the brass medallion look like a smiling cartoon face. Same smile arc leaked into the
  small hero owl mark.
- **Midnight Fizz lemon coin floated above the glass** like a halo — a detached ellipse sitting in the
  air above the rim instead of a garnish resting on it.
- **Quiz card had a large dead zone** below the answer dots (min-height 420 with content centred left a
  big empty band), reading as an unintentional gap.
- **Back-bar bottle necks hard-cut at the top edge** of the hero — the tallest bottles ran off the top
  with an abrupt straight edge rather than dissolving into the dark.
- Everything else (menu grid rhythm, glass illustrations, room layout, reservation form, typography,
  colour harmony) landed well on the first pass.

Changed:
- Rebuilt the owl: removed the chest "smile" and the happy brow arcs; enlarged the eyes and set them
  adjacent (overlapping) with a feathered brow ridge and a small downturned beak. Applied consistently
  to the knocker and the hero mark.
- Reworked the Fizz garnish into a proper lemon **wheel perched on the rim** (rind ring + segment lines,
  tilted), overlapping the rim so it reads as resting on it.
- Reduced the quiz card min-height and added a **faint owl watermark** centred behind the question to
  give the panel presence and kill the dead zone.
- Capped back-bar bottle heights and added a top **mask-image fade** so bottle tops dissolve into the
  darkness instead of hard-cutting.

## Pass 2 — recheck + interactive flow test (45-p2-*.png)

Re-screened entrance, hero, menu, quiz; ran a puppeteer flow test.

Found:
- Owl now reads unmistakably as an owl (verified in the 1440 entrance shot); back-bar tops fade
  softly; Fizz wheel sits correctly on the rim.
- **Flow test passed:** clicking the brass knocker opens the door and reveals the bar
  (`DOOR_OPENED_AFTER_KNOCK: true`); the quiz scored gin + celebratory + bright →
  **Midnight Fizz** (`QUIZ_RESULT` correct), result flourish rendered with glass, name, base and the
  owl's one-line reasoning. Zero console errors through the whole flow.
- **The mini glass inside the quiz result still used the old floating-halo coin** (the result reuses a
  simplified inline SVG that hadn't been updated with the menu fix).
- Result `base` label (`GIN · ELDERFLOWER`) was a touch too dim to read comfortably.

Changed:
- Updated the Fizz result-glass data to the perched wheel; brightened `.result-base` from the dim brass
  to full brass.

## Pass 3 — verification (45-p3-*.png)

Full re-screen: entrance, hero, menu (row 1), quiz, room, mobile hero, mobile menu, and a dedicated
`prefers-reduced-motion` render.

- All sections compose cleanly at **1440×900 and 390×844**; menu collapses 3→2→1 columns; room grid
  and reservation form stack correctly on mobile.
- **Reduced-motion check:** door pre-opened (`display:none`), smoke canvas off (`display:none`), scroll
  unlocked, layout calm and intentional — no console errors.
- Zero console errors on every shot at both widths. No overflow, no default-browser elements, no black
  canvas. Shipping.
