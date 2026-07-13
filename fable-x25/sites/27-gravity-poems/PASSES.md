# 27-gravity-poems — iteration passes

Physics is 100% hand-rolled: verlet integration (position + angle), AABB word-box
collision with positional correction / friction / torque, spring constraints,
gravitational attraction with softening, value-noise turbulence. No libraries.
Screenshots served over `http://localhost:8902` using `?ch=N&settle=1` (jumps to a
chapter and fast-forwards the sim so the law's signature state is visible).

## Pass 1 — full sweep (intro, ch1–ch5 @1440, ch1+intro @390)

Found:
- **ch1**: pile buried the RESTACK button (transparent bg, words visible through it);
  a word ("holding") slid onto the FABLE ×30 backlink; huge dead zone mid-viewport
  where the verse used to be — absence read as emptiness, not as meaning.
- **ch1 mobile**: floor pile overlapped the bottom-left annotation ("F = m·g") and
  backlink — illegible collision of marginalia and physics.
- **ch2**: wind displacement too strong relative to anchor springs — words stacked on
  top of each other ("keeps/no", "meant/I"), poem clumped and sagged.
- **ch4**: words got stranded along the surface line far from their verse slots
  ("almost and a rises, loosens…" pinned across full width) — capture radius required
  x-proximity that wobble drift made unreachable; poem never assembled.
- **intro mobile**: laws row ran edge-to-edge, brushing the nav dots.
- ch3 / ch5 signature states (orbit ring, half-crumbled dust) rendered correctly.
- Zero console errors at both widths.

Changed:
- `.ch-btn` gets a bone background (floats legibly above piles/dust).
- ch1: side floor padding `max(24px, 12vw)` keeps the pile off corners/marginalia;
  added a **ghost verse** layer — the composed poem at 7.5% ink marking where the
  words fell from (also the restack target); mobile annotation moved to top-left.
- ch2: springs 24/34 → 32/44, wind 5200 → 4300, gusts 1500 → 1100, tilt eased.
- ch4: rising words get an x-homing force toward their slot; capture triggers on
  reaching the verse band (`y <= home.y + 56`) instead of radial distance; spawn
  jitter ±120 → ±80.
- intro laws row padded.

## Pass 2 — re-shoot ch1/ch2/ch4 @1440, ch1/ch4/ch5 @390

Found:
- ch1 now excellent: ghost verse fills the dead zone with meaning, pile centered,
  button/annotation/backlink all clear. ch4 poem fully assembles under the surface,
  desktop and mobile. ch5 mobile dust state reads beautifully.
- **ch2**: still a few hard overlaps where neighbouring words share similar noise
  ("The/wind/keeps/no" fused, "leaves/me") — flutter fine, stacking not.

Changed:
- `collide()` gained a strength parameter; ch2 runs a soft separation pass (k=0.18,
  no friction/torque side-effects) each step — words shoulder past, never merge.

## Pass 3 — ch1/ch2/ch3 @1440 + @390 (brief minimum), end section, functional tests

Found:
- ch2 desktop: fully legible, alive, zero stacking. ✓
- **ch2 mobile**: "appointments." / "say," blown off the right edge, under nav dots.
- **ch3 mobile**: `maxR` was `max(W,H)*0.72` — orbits carried words outside the
  390px viewport, words clipped at the left edge.
- End/colophon composed; intro strong at both widths.

Changed:
- ch2: soft screen-edge springs (force ramps inside 16px margins) — the gale never
  blows a word off the page.
- ch3: `maxR = min(W*0.46, H*0.42)` — comet drag confines orbits to the viewport at
  any aspect ratio.

Verification (post-fix, same pass):
- Re-shot ch2/ch3 mobile + ch3 desktop: all on-screen, ring signature intact.
- Puppeteer interaction test: drag-fling moves a word (transform + rotation confirmed),
  RESTACK reassembles all 19/19 bodies and toggles to "release", ch5 breath click +
  REMEMBER restores 96/96 letters to full opacity, orbit throw ok — no console errors.
- `prefers-reduced-motion` emulated: physics never boots, poems render as static
  composed verse, red mono note "motion reduced — the poem holds still.", buttons and
  hints hidden. No console errors.

Final state: zero console errors at 1440×900 and 390×844 across intro, all five
chapters (settled), end section, and under interaction.
