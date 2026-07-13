# 30-orrery — EPHEMERIS · iteration passes

Screenshots taken over local HTTP (`python3 -m http.server 8904`), 1440×900 and 390×844,
waitMs 4500. Zero console errors on every shot in every pass (`NO_CONSOLE_ERRORS`).

## Math verification (done before pass 1, re-confirmed in final UI)

Ran the ephemeris core (`assets/ephemeris.js`, Standish/JPL Table 1 elements) in Node:

- **Earth heliocentric longitude, 2026-07-13** → **290.76°** (expected ≈ 291°) ✓
- **Sun geocentric longitude** = Earth helio + 180 → **110.76° = Cancer 20°45′** (expected ≈ 111°, Cancer) ✓
- **Jupiter geocentric, 2026-07-13** → **122.5° = Leo 02°31′** (expected Cancer/Leo region mid-2026) ✓
- **Calibration against history**: asked to find the last great conjunction, the scanner returns
  **21–22 Dec 2020 at 0.100° (0°06′)** — the recorded minimum was 0.102°. Forward scan finds
  **30 Oct 2040 @ 1°08′ (Libra)**, 2059/2060 pair, and the sub-degree **14 Mar 2080 @ 0°06′ (Aquarius)**,
  matching published dates. Scan cost: ~4 ms, so it runs live in the browser at load.
- Kepler solver residual |E − e·sinE − M| = 0 to machine precision at Mercury-grade eccentricity.
- Moon dial: 2026-07-13 → waning ~2% lit (new moon was 14 Jul 2026 ✓); 1969-07-20 → waxing 33%
  (Apollo 11 landed under a waxing crescent/first-quarter moon ✓).

## Pass 1 — `30-p1-today.png`, `30-p1-1969.png`, `30-p1-math.png`, `30-p1-mobile.png`

Found:
1. Fold broken at 1440×900 — controls strip entirely below the viewport.
2. Reading rows ragged: sub-lines wrapped (“0.57 au” spilling to a second line); LUNA zodiac
   format inconsistent (degrees only, no minutes).
3. Composition drift: orrery plate floated left with a dead zone before the reading column.
4. Cardinal degree numerals (0°/90°/180°/270°) drawn at r=462 — **outside the 900 viewBox, clipped
   invisible** (real bug).
5. Zodiac glyphs too faint/small; parchment header left a large empty right region.
6. Newton formula broke onto a line starting with a lone “⁄”.
7. (Pre-shot fix) label knockout rect replaced with paint-order stroke halo so ring labels don’t
   erase neighbouring rings.

Changed: tightened masthead/date verticals; `grid-template-columns:auto 328px; justify-content:center`;
viewBox expanded to −28…956 and numerals kept inside; glyphs 17px full-opacity; nowrap subs +
`λ …° · … au` format; LUNA gets minutes; parchment header made two-column; Newton formula recast as
Δₙ form; added faint radial back-plate wash to seat the instrument.

## Pass 2 — `30-p2-today.png`, `30-p2-2400.png`, `30-p2-conj.png`, `30-p2-mobile.png`

Found:
1. Controls still clipped ~30px at the fold (flywheel bottom cut).
2. Conjunction list tags read “+19 YRS” for both 2059 and 2060 (rounded from the same anchor) —
   reads as a bug.
3. Mobile masthead kicker wrapped awkwardly at .44em letterspacing.
4. Verified: 2400-01-01 endpoint renders correctly (JD 2597642, T +3.9999); moon dial lit on the
   correct limb for both waxing (2400: 16% right) and waning (2026: 2% left); conjunction card
   typography strong.

Changed: orrery sized to `calc(100vh − 352px)`, flywheel 92→78px, controls padding trimmed —
instrument now fully composed inside one 1440×900 viewport; conjunction tags changed to years-from-now
(“+33 YRS OUT”); mobile kicker 8.5px/.3em.

## Pass 3 — `30-p3-today.png`, `30-p3-1969.png`, `30-p3-2400.png`, `30-p3-claim.png`, `30-p3-colophon.png`, `30-p3-mobile.png`, `30-p3-mobile-controls.png`

Found:
1. Full instrument (masthead, engraved date, plate, reading column, flywheel/steppers/escapement)
   composes inside the fold at 1440×900 for today, 1969-07-20 and 2400-01-01.
2. Claim, mathematics (parchment), conjunctions, colophon and footer all verified mid-scroll —
   spacing rhythm and contrast hold; retrograde badges (Mercury ℞, Neptune ℞ for July 2026) correct.
3. Mobile: instrument scales, reading column stacks below the plate, controls wrap cleanly
   (verified via `?scroll=controls`); added `id="controls"` for that choreography — only change
   this pass. No remaining defects found; zero console errors at both widths.
