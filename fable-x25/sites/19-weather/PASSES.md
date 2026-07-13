# NEPHOLOGY — iteration passes

Ambient weather site. Full-viewport generative canvas sky per condition, enormous thin
temperature numeral, poetic condition line, 7-day strip, city search, and a dev "sky picker"
that forces conditions via `?wx=rain|storm|clear-night|snow|clear|...`. Live data from
Open-Meteo with baked Singapore fallback so it never shows a broken state.

Screenshots served over `http://localhost:8719/sites/19-weather/` (so `fetch` + the `/` back-link
resolve). Verified live fetch succeeds in headless (real 26.7° Singapore data) AND the baked
fallback renders when the fetch loses the race — both are correct, never-broken states.

---

## Pass 1 — baseline capture & critique

Captured default + `?wx=rain|storm|clear-night|snow|clear` at 1440×900, plus `clear`/`storm`
at 390×844. Console: **NO_CONSOLE_ERRORS** at both widths across every condition.

What's already strong: each condition reads as a distinct atmosphere (indigo partly-night with
carved moon, slate-cyan rain with streaks + splashes, near-black charged storm, milk-white snow
with dark ink numeral). Giant Outfit numeral is elegant; Fraunces italic poetic line is legible;
forecast strip is clean glass; palettes cross-fade smoothly.

Problems found:
1. **Sun/moon collide with the hero text on portrait.** On `clear` at 390×844 the sun disc sits
   directly over the locale line ("103.82°E") — the celestial body is placed at a fixed viewport
   fraction that works on landscape but the vertically-centered hero rises into it on mobile.
   Legibility hit on the locale + halo washing the top of the numeral.
2. **Snow reads a touch sparse** at 1440 — elegant but could carry the "snow" identity harder.

Fixes applied:
- Made sun & moon positions **portrait-aware**: pushed higher on tall viewports (sun `y .20→.14`,
  moon `y .18→.12` in portrait) and nudged both up slightly on landscape so the broad halo no
  longer overlaps the temperature numeral.
- Bumped snow flake count 170→230 and widened the size range for a fuller, still-soft fall.

---

## Pass 2 — verify fixes

Re-shot `clear` at 390 + 1440, `clear-night` at 390, `snow` at 1440, `rain` at 390.
Console: **NO_CONSOLE_ERRORS** everywhere.

- **Sun/moon collision resolved.** On `clear` 390 the sun now sits in the top-right corner well
  clear of the locale line; the whole "SINGAPORE · … · CLEAR DAY" reads cleanly. On `clear-night`
  390 the moon lifts into the corner and its halo glows softly behind the glass search pill
  (reads intentional). On `clear` 1440 the sun sits upper-right and its soft halo no longer
  reaches the temperature numeral — airy blue-to-warm-horizon scene, distinctly a day sky.
- **Snow** now carries a fuller, denser fall while staying soft; dark-ink numeral stays crisp on
  the milky palette. Clearly distinct from every other state.
- Rain 390 confirmed clean: moody slate, streaks, legible numeral + Fraunces line.

No new problems. Composition, hierarchy and per-condition palettes all holding.

---

## Pass 3 — final verification sweep

Required forced set at 1440: `?wx=rain`, `?wx=storm`, `?wx=clear-night`; plus default at 390;
plus a **prefers-reduced-motion** capture (`?wx=storm`, via emulateMediaFeatures).
Console: **NO_CONSOLE_ERRORS** at both widths, every condition.

Verified:
- **Each state beautiful & distinct** — indigo/silver clear-night with carved moon, slate-cyan
  rain with streaks + splash rings, near-black charged thunderstorm, milk-white snow. Palettes
  cross-fade smoothly through the shared blend engine.
- **Giant numeral** elegant thin Outfit, tabular figures, superscript degree; **poetic line**
  legible Fraunces italic in every palette; **forecast strip** clean glass, tidy glyphs/highs-lows.
- **Reduced motion**: renders a fully composed *static* storm (sky + clouds + frozen rain +
  numeral + strip) then holds — grain/entrance transitions disabled, calm and legible. No RAF spin.
- **Graceful fallback proven**: the default-390 shot happened to lose the fetch race and rendered
  the baked Singapore data (31.4°, rain-day) as a complete, un-broken scene — exactly the
  never-broken guarantee. Other runs showed live data (26.7°, real Singapore). Both are correct.
- **Chrome**: inline-SVG emoji favicon (no 404), `<title>` + meta description, `FABLE ×25`
  back-link (top-left, links to `/`) present in every frame.
- **`?wx=` forcing** confirmed for rain / storm / clear-night / clear / snow (+ aliases).

No outstanding issues. Build is ship-ready.

