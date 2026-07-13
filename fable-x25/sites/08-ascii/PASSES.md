# PASSES — 08-ascii · PHOSPHOR

Screenshots live in `passes/`. Served over local HTTP (`python3 -m http.server`) — file:// is
avoided per prior findings about headless canvas quirks; the shot tool also reports console errors.

## Pass 1 — `08-p1-*.png` (desktop 1440×900, mobile 390×844, #fire, #life, ?theme=amber)

**Console:** zero errors at all five captures.

**Found (merciless read):**
1. **Torus reads as an egg, not a donut.** The old tumble `R = Ry(B)·Rx(A)` gives
   `axis·view = −sinA·cosB`, which crosses zero twice per B-cycle — the ring goes edge-on and the
   hole vanishes for seconds at a time. Both desktop and amber captures landed in that window.
2. **Shading flat-bright.** Light vector had a −0.9/−0.45 frontal z-bias, contrast pow 1.45 —
   almost the whole visible surface quantized to `@`/`%`, killing the 3-D gradient.
3. **Fire fills the tube to the very top row** — avg cooling ~0.78/row over 32 rows meant heat
   routinely survived to row 0. Reads as full-screen static, not flames with dark headroom.
4. **Life tube too sparse** at capture (gen 47, pop 62): gun top-left, everything below vacuum.
   Composition dies for anyone arriving mid-scroll.
5. **Mobile plaque wraps mid-token** ("PHOSPHOR CRT-" / "9 VECTOR-TO-") — `&nbsp;` chains made one
   unbreakable string; serial also broke inside the number.
6. Copy bugs: footer claimed "12-step ramp" (ramp is 10 glyphs); method card said "two rotation
   matrices" which the fix below makes wrong anyway.
7. Dead code: unused `measureCharW()`, unused `runningPop` in `layout()`.

**Fixed:**
1. Rewrote hero rotation as gyroscopic precession `R = Rz(ψ)·Rx(tilt)·Ry(spin)` with
   tilt = −0.82 + 0.24·sin(wob): `|axis·view| = |sin tilt|` stays in ~0.54–0.87, so the hole is
   *always* visible while the donut precesses and wobbles. Spin drives cube/icosa motion.
2. Light z-bias softened to −0.75/−0.25, contrast curve raised to pow 1.75 — full ramp now in play.
3. Fire cooling raised to avg ~1.45/row (`v − 1 − ⌊rand·1.9⌋`) — flames die ~3/4 up the tube.
4. Life opening tableau: Gosper gun (top) + period-3 pulsar (lower-left) + two LWSS cruising right
   (lower half) + the two gliders. Whole tube has life at any capture moment.
5. Plaque: breakable separators + mobile `flex-wrap` + tighter tracking; serial made unbreakable.
6. Footer "10-step ramp"; method card copy now describes spin/tilt/precession.
7. Removed dead code. Added deep-link presets `?obj=`, `?ramp=`, `?theme=` (double as test hooks).

## Pass 2 — `08-p2-*.png` (desktop, mobile, #fire, #life, ?theme=amber, obj/ramp variants)

Log for this pass was not committed; captures in `passes/` confirm the pass-1 fixes held —
fire showed dark headroom with rising tongues, Life showed the full opening tableau (gun +
pulsar + LWSS), and the `?obj=cube`/`?obj=icosa&ramp=braille` variants rendered cleanly.

## Pass 3 — `08-p3-*.png` (desktop 1440×900, mobile 390×844, #fire, #life, ?theme=amber)

**Console:** zero errors at all five captures (green + amber).

**Found (merciless read):**
1. **Desktop/amber hero didn't read as a donut — worst offender.** `fitScreen()` sized the hero
   glyph by *width only*, so at 1440 the 46-row tube rendered ~640px tall + chrome ≈ 760px and the
   whole plate overflowed the 900px viewport. The torus is centred at `ROWS/2`, so its centre — and
   the hole — sat below the fold; only the top cap was visible, reading as a solid downward-widening
   mass with no hole. Mobile (shorter tube, whole donut in-frame) proved the math was fine; the
   framing was the bug.
2. Fire (dark headroom, licking tongues) and Life (gun + pulsar + 2×LWSS, gen 62 / pop 139) both
   read exactly as intended — no change needed.

**Fixed:**
1. Made `fitScreen()` height-aware: added optional `rows`/`maxH` args; font-size is now
   `min(width-fit, maxH/(rows·1.2))`. Hero passes `maxH = min(innerHeight·0.52, 470)` on desktop
   (null on mobile, which was already correct). The full tube, centred donut, and plaque now sit
   above the fold with intentional dark margins, and the CRT height balances the control panel.
   Re-shot desktop + amber: both now read unmistakably as a 3-D ASCII donut with a clear hole.
   Fire/Life untouched. Verified favicon, FABLE ×25 back-link, reduced-motion still branch, and
   rAF-pause-when-hidden (both loops are pure `requestAnimationFrame`).
