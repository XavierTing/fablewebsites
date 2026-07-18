# THE TWELVE HOUSES — Iteration Passes

A gilded astrological almanac: an engraved circular zodiac wheel drawn in SVG
(concentric rings for the 12 signs + 12 houses, a 360° degree-tick ring, elemental
glyph colouring, and a decorative ring of the seven classical planets), a rotating
brass-dial that turns to spotlight the chosen sign, an elegant reading card, and a
deterministic **seeded daily-reading generator** (phrase banks assembled from
sign + date, so every sign and every day reads differently but always gracefully).

Served over local HTTP on **port 8930** and captured with
`assets-pipeline/shot.mjs`. Sign spotlighting for screenshots uses the implemented
`?sign=<name>` and `?date=<yyyy-mm-dd>` params; lower sections via `?view=<id>`.
Fonts: **Cormorant Garamond** (celestial serif — sign names, readings) +
**Space Grotesk** (dates, degrees, UI caps).

---

## Pass 1 — first render (`55-p1-*.png`)
**Captured:** desktop `?sign=leo` (1440×900), mobile `?sign=scorpio` (390×844).

**Worked immediately:** the SVG wheel geometry is correct — concentric sign/house
rings, 360 engraved degree ticks (1°/5°/10°/30° weights), house Roman numerals,
planet ring, meridian pointer, and the centre medallion all register; the dial
rotated Leo/Scorpio to the top; palette (indigo #0b1026 + gold #d9b45b), nebula,
starfield, grain and vignette all read; the reading card, daily generator, and
love/work/mood trio populated. Zero console errors both widths.

**Problems found:**
- **Critical:** the zodiac glyphs (♈♉…) and the big centre glyph rendered as
  **colour emoji** (purple app-icon squares) instead of monochrome engraved gold —
  the default Unicode *emoji* presentation. This broke the astrolabe aesthetic.
- Desktop vertical composition: `align-items:center` on the stage + an oversized
  wheel pushed the wheel below the fold, leaving a dead zone under the masthead.

**Changed:** appended the **U+FE0E text-presentation selector** to every displayed
sign / planet / ruler glyph (wheel band, medallion, card, strip, matches, aspect),
forcing crisp monochrome text that takes the gold/element fill. Set the stage to
`align-items:start`, trimmed the wheel to `min(90vw,500px)`, and reduced hero /
masthead padding so the full wheel sits inside 1440×900.

---

## Pass 2 — the engraving reads (`55-p2-*.png`)
**Captured:** desktop `?sign=leo`, mobile `?sign=pisces`, a tall full-card shot,
plus `?view=s-twelve`, `?view=s-elements`, `?view=s-houses`, and mobile `s-twelve`.

**Verified fixed:** glyphs now render as gilded monochrome engraving tinted by
element (fire warm, earth sage, air sky, water teal); the active sign glows gold in
the band and large in the centre medallion; the whole wheel fits at both widths.
The lower sections all compose cleanly — *The Twelve at a Glance* grid (12 cards),
*Elements & Modalities* (four alchemical-triangle element cards + three modalities),
*The Twelve Houses* legend + the generated *Aspect of the Day* flourish, and the
footer with its "for reflection, not prescription" disclaimer. Zero console errors.

**Problems found:** minor only — a redundant duplicate `font-size` on `.subtitle`;
sections needed deep-link scrolling so they could be screenshotted (the hero is
`100svh`). No layout or contrast defects.

**Changed:** removed the duplicate rule; added section ids (`s-twelve`,
`s-elements`, `s-houses`) and a `?view=` / `#hash` scroll handler for deep-linking.

---

## Pass 3 — behaviour & edge states (`55-p3-*.png`)
**Captured:** reduced-motion desktop (puppeteer `prefers-reduced-motion:reduce`
emulation), the **default no-param** desktop load, and a tall mobile reading card
(`?sign=libra`, 390×1500).

**Verified:**
- **Default load** auto-selects **today's sun sign** (Cancer, 18 July) — the dial
  turns to it and the medallion shows *"☉ THE SUN IS HERE"*; the whole card,
  ruler glyph (Moon), element (Water) and daily reading populate correctly.
- **Reduced motion:** the wheel is **fully static — no rotation** (Aries stays at
  the meridian); selection is still conveyed by the in-place gold sector glow, the
  centre medallion, and the reading card. Confirmed via emulated media feature.
- **Mobile reading card:** stacks below the wheel with no overflow — header, meta
  chips, essence, today's reading + love/work/mood, strengths/shadows all legible.
- **Zero console errors** at every width and state tested.

**Changed:** nothing structural — pass 3 confirmed the build. Generated
`assets/og.jpg` + `assets/thumb.jpg` (1200×630) so the social meta and gallery card
resolve.

---

### Result
A refined gilded-astrolabe horoscope: an SVG zodiac wheel that turns to your sign,
accurate data for all twelve signs (dates, element, modality, ruling planet,
traits, strengths/shadows, compatibility, lucky day/colour/stone), a graceful
seeded daily reading, and a celestial-midnight aesthetic — Cormorant Garamond over
Space Grotesk, gold on deep indigo. Distinct from the collection's astronomical
star atlas (48) — this is the *astrological* zodiac. Reduced-motion safe, zero
console errors, responsive at 1440×900 and 390×844.
