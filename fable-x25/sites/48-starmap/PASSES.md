# URANOMETRIA — Iteration Passes

An interactive celestial atlas: a real catalogue of the brightest stars projected
stereographically onto a draggable, zoomable celestial sphere, with ~19 constellation
figures + mythology, a computed Milky Way band, ecliptic, and deep-sky markers.

Screenshots served over local HTTP (`python3 -m http.server 8923`) and captured with
`assets-pipeline/shot.mjs`. Framed-constellation shots use the implemented
`?center=<key>&lines=1` query params. All shots at 1440×900 and 390×844, waitMs 4500.

---

## Pass 1 — first render (`48-p1-*.png`)
**Captured:** framed Orion (`?center=orion&lines=1`), wide sky, mobile.

**What worked immediately:** stereographic projection is clean; Orion / Big Dipper are
recognizable; Milky Way band (galactic-matrix transform) runs correctly through
Sagittarius→Cygnus; ecliptic, deep-sky markers, spectral star tints, twinkle, and the
17th-century atlas UI (Cormorant + IBM Plex Mono, gold plate frame) all read. Zero
console errors both widths.

**Problems found:**
- Framed Orion shot marred by faint straight lines crossing the whole frame — neighbouring
  constellations' base lines whose *both* endpoints are off-screen were still being stroked.
- The selected/highlighted figure lines were too thin/faint to pop.
- **Dock overflow:** `.jump` chips laid out at max-content (not constrained to the dock
  width), so chips spilled off the right edge at *both* 1440 and 390.
- Readout collided with the top-left plate-corner ornament.

**Changed:** clip a segment when both endpoints are off-screen (+ tighter long-segment cap);
bumped highlighted-line width/brightness/glow; constrained `.jump`/`.toggles` to `width:100%`
inside a narrower dock; nudged the readout clear of the plate corner.

---

## Pass 2 — composition & the Milky Way (`48-p2-*.png`)
**Captured:** framed Orion, framed Scorpius, wide sky, mobile, essay (`#essay`).

**Verified fixed:** ghost cross-lines gone; Orion + Scorpius figures now glow clearly (the
scorpion's curling tail reads beautifully); dock chips wrap within their box; essay section
is elegant and legible with faint stars showing through the heading.

**Problems found:**
- Milky Way near the galactic centre (Scorpius/Sagittarius) looked like discrete
  "cotton-ball" blobs rather than a smooth luminous river.
- Constellation labels near the bottom could still render behind the dock (e.g. Canis Major).
- Mobile bottom zone crowded: jump chips + toggle row overflowed 390px, and the scroll cue
  overlapped the centred back-link.

**Changed:** Milky Way regenerated with ~2.4k smaller, fainter, overlapping points (smoother
band, gentler bulge, Great-Rift dimming preserved); raised the label bottom-exclusion margin;
reworked the mobile dock — horizontal-scroll jump strip with edge mask, shortened toggle
labels ("Lines"/"Reset"), corner-anchored back-link (bottom-left) and a compact chevron
scroll pill (bottom-right).

---

## Pass 3 — polish & a real rendering bug (`48-p3-*.png`)
**Captured:** framed Orion, Ursa Major, Cygnus, wide sky, mobile, plus a
reduced-motion render (`prefers-reduced-motion: reduce` emulated).

**Verified fixed:** Milky Way now reads as a soft river of light; Big Dipper and the
Northern Cross (Cygnus, with Lyra/Vega alongside) are instantly recognizable; deep-sky
labels no longer tuck under the dock; mobile bottom is clean with zero overlaps.

**Bug caught by comparing normal vs reduced-motion renders:** the highlighted figure was
**bold in reduced-motion but faint in normal motion**. Cause — after the twinkle loop,
`drawOverlay` switched compositing back to `source-over` but never reset `ctx.globalAlpha`,
leaving it at the last twinkler's low value (~0.1), which then multiplied the gold
constellation lines down to near-invisible. In reduced-motion the twinkle block is skipped,
so alpha stayed 1. **Fixed** by resetting `ctx.globalAlpha = 1` before drawing the figure —
now both paths render the figure boldly and identically.

**Result:** zero console errors at 1440×900 and 390×844; reduced-motion renders a fully
static sky (twinkle + shooting stars off, jumps instant) with no errors; rAF pauses on
`visibilitychange`; DPR capped at 2. Constellations read clearly and beautifully.
