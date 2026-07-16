# THE LUMEN — Iteration Passes

Site: `sites/47-cinema/` · A single-screen repertory cinema + kinetic title-design / typographic-poster showcase.
Served over local HTTP on `:8922`. Screenshots use `?titledone=1` so the intro rests in a composed frame.
All captures verified **zero console errors** at 1440×900 and 390×844.

---

## Pass 1 — first full build, critique the raw composition
Shots: `47-p1-hero-desktop`, `47-p1-showing`, `47-p1-schedule`, `47-p1-booking`, `47-p1-member`, `47-p1-mobile`.

**Found**
- Hero (composed frame): the Saul-Bass sweeping colour bars only travelled to `x:120%`, so the scarlet/amber/cream bars were still parked on-screen in the resting frame. The cream bar sat *behind the tagline*, blocking "the light" and hiding the Autumn Season badge. The intro flourish must fully clear the frame.
- Custom cursor rendered its ring at the exact viewport centre in every screenshot (no pointer movement in headless) — a stray artifact; also visible on the "mobile" shot because headless Chrome still reports a fine pointer.
- Mobile hero badly crushed: a strict 2.39:1 letterbox on a 390×844 portrait viewport yields a ~163px film band with ~340px bars, squeezing the title so `THE`, the kicker, the sub and the badge were clipped.
- Posters, schedule marquee, booking/ticket, membership all read strongly — kept.

**Changed**
- Rebuilt the bass bars as full-width (`left:0;width:100%`) and drove them with `xPercent` (−112 → 0 → 114) so they sweep fully across and completely off the right edge; resting frame is now clean.
- Cursor starts `opacity:0` and only reveals on first `mousemove` — no more centre-ring artifact in stills.
- `barH()` now caps each letterbox bar at `17%` of viewport height, so the film band never collapses on portrait. Desktop keeps its ~2.39:1 look; mobile gets a comfortable band.

## Pass 2 — recompose hero, refine a weak poster, verify interaction + reduced-motion
Shots: `47-p2-hero-desktop2`, `47-p2-mobile2`, `47-p2-showing`, `47-p2-ticket-torn`, `47-p2-reduced-hero`.

**Found**
- Desktop hero: with the bars gone the frame was clean, but the giant `LUMEN` (clamp max 236px) plus the whole stack overflowed the 602px band (`overflow:hidden`), so the kicker (`EST. MCMLXXIV…`) and the Autumn Season badge were clipped — they never appeared on desktop, not just in the shot.
- Neon-noir poster ("Last Call"): the vertical cyan tube floated under the title and read like a stray line rather than a designed element.

**Changed**
- Reduced the hero title to `clamp(56px,14vw,200px)` so the full stack (kicker · THE · LUMEN · tagline · sub · season badge) fits inside the letterboxed band on desktop while staying bold and poster-scale.
- Replaced the floating neon tube with a centred horizontal neon underline + glowing `OPEN · TILL LATE` sub-label — reads as an intentional bar sign.
- Verified via a scripted run: selecting seat E-01 updates the ticket (row/seat/№) and enables the Tear button; tearing sets `.torn`, clips the stub away and reveals "ENJOY THE SHOW". Reduced-motion emulation renders the title composed, grain static, no weave/flicker — **no console errors** in either.

## Pass 3 — final polish sweep, both widths + mobile scroll states
Shots: `47-p3-hero-desktop`, `47-p3-showing`, `47-p3-schedule`, `47-p3-member`, `47-p3-mobile-hero`, `47-p3-mobile-posters`, `47-p3-mobile-booking`, `47-p3-intro-midframe`.

**Found**
- Desktop hero now complete and balanced — kicker, THE, LUMEN, tagline, sub and the season badge all sit inside the frame with the amber letterbox rules; no clipping.
- Six posters read as six distinct art-directions (brutalist concrete + eclipse sun, deco sunburst frame, neon-noir sign, Swiss red-bar grid, giallo blood-drip, retro-future synth-sun). Schedule marquee with blinking bulbs and the seat-map/ticket both compose cleanly.
- Mobile: posters stack full-width and stay gorgeous; the schedule rows reflow (format tag drops to its own line); the seat map + full ticket stub fit within 390px.
- Live (no `?titledone`) mid-frame confirms the kinetic sequence actually plays — tagline caught mid clip-wipe, letterbox opened, title cut in.

**Changed**
- No further structural changes required — this pass was verification. Confirmed zero console errors at both widths across hero, posters, schedule, booking and membership, and in the reduced-motion and interaction runs.

---

### Standing quality checks
- Zero console errors, 1440×900 and 390×844 (every capture reported `NO_CONSOLE_ERRORS` / `NO_ERRORS`).
- `prefers-reduced-motion`: title shown composed, grain a single static frame, gate-weave/searchlight/flicker disabled, reveals shown immediately.
- rAF loops (grain, gate-weave, searchlight) pause on `visibilitychange`; grain drawn at low-res (170×~96) then scaled; DPR not multiplied.
- Back-link reads **XAVIER FABLE ×50** → `/`. `<title>`, meta description and inline-SVG emoji favicon present. Styled scrollbar, `::selection`, `:focus-visible`, custom cursor.
