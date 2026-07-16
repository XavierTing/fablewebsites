# ESCAPEMENT — Iteration Passes

Site: `sites/41-escapement/` · Concept: a working mechanical watch movement drawn live in SVG —
a going train meshing at true horological ratios driving a Swiss lever escapement, with hands
that tell the real local time. Beat rate 28,800 vph (8 beats/s). Brass-on-charcoal default,
blueprint (cyan on navy) as a toggle. Served on `http://localhost:8916`.

**Horology that is actually real, not decorative:**
- Tooth counts chosen so the ratios are correct: centre wheel = 1 rev/hour (minute hand),
  fourth wheel = 1 rev/minute (60× centre, seconds), escape via 72:6 pinion + 20-tooth wheel
  → exactly 8 beats/s = 28,800 vph. Barrel turns ~1 rev / 7.5 h.
- Mesh phasing is computed, not eyeballed: `meshOff()` solves each driven pinion's clocking
  so a tooth always meets a gap (frac₁+frac₂ = 0.5) at the line of centres; because every wheel
  is derived from one beat clock with exact integer ratios, the whole train stays rigidly meshed
  at all times and all speeds.
- The entire train + hands are driven off the beat-quantised real clock, so it reads live time
  and the escape wheel visibly ticks 9°/beat while the seconds hand sweeps in beats.

---

## Pass 1 — build + first art-director critique
Screenshots: `41-p1-desktop/blueprint/exploded/mobile.png`, `41-p1-scroll1/scroll2.png`

**Found:**
- First layout was too steep/tall — the movement spilled below the fold; barrel and hands clipped.
- Balance wheel overlapped the escape wheel and read as a big empty ring.
- Pallet fork rendered as a clumsy white arrow — did not read as a lever escapement.
- Going-train wheels (all same brass) overlapped into a muddy mass; meshing was hard to see.
- Plate had an empty concentric "bullseye" in dead space; caliber block collided with a part label.

**Changed:**
- Recomputed the arbor layout as a gentle arc (barrel → centre → third → fourth → escape → balance),
  aspect ~2.0, framed in a `780×430` viewBox; capped movement width so it sits above the fold.
- Separated the balance from the escape wheel; tightened the hairspring to a real 11-turn spiral.
- Rebuilt the pallet fork as a proper anchor: slim lever, two ruby pallet stones on the escape rim,
  fork horn + notch to the balance roller, pivot jewel.
- Added blurred cast-shadow discs under each wheel → wheels now read as stacked planes (real-movement
  depth) instead of muddy overlap; reworked the metallic gradient for tooth definition.
- Centred the plate on the movement, replaced the bullseye with scattered perlage graining + a curved
  engraved caliber legend; removed/relocated the colliding caliber marking.

## Pass 2 — escapement, exploded view, motion
Screenshots: `41-p2-desktop.png`

**Found:**
- Exploded toggle was too subtle (only jewels nudged) — didn't read as an exploded diagram.
- Fork snap logic had dead/confusing code; balance rim was a little pale vs. the dense gears.
- One part label ("Swiss lever · pallet fork") overflowed the right frame edge.
- Part labels were illegible noise at 390 px.

**Changed:**
- Rebuilt exploded view: components now spread **radially from the dial**, cap jewels + bridges
  lift up-left with drop shadows, and faint dashed **assembly-guide rays** appear — a true
  watchmaker's exploded diagram. Assembled↔exploded eases via rAF lerp.
- Cleaned `forkAngle()` to a single eased bank-to-bank snap synced to the balance centre-crossing;
  thickened the balance rim and added an outer guard ring.
- Fixed the label overflow (shortened + re-anchored); enlarged the plate so it frames the balance.
- Hid SVG part-labels/leaders + caliber block below 600 px for a clean mobile movement.
- **Verified motion**: captured the escapement region 260 ms apart — balance spokes at clearly
  different phases while the second unchanged, confirming the 4 Hz oscillation + tick are live.

## Pass 3 — final QA across all states
Screenshots: `41-p3-desktop/blueprint/exploded/mobile/mobile-blueprint/reducedmotion.png`

**Verified:**
- **Zero console errors** at 1440×900 and 390×844 (every shot reports `NO_CONSOLE_ERRORS`).
- **Interactions**: scripted click-through of Beat(pause/play), Wind(hold), Exploded, Blueprint,
  and the B/E/P keyboard shortcuts → `INTERACT_ERRORS: NONE`.
- **No mobile horizontal overflow**: `scrollWidth 390 == innerWidth 390`.
- **Reduced-motion**: emulated `prefers-reduced-motion: reduce` → static assembled movement at load
  time, no spin, no rAF, reveals shown instantly.
- **Blueprint** reads as a clean cyan technical schematic (teeth interleaving clearly visible);
  **exploded** and **mobile** both intentional and legible.
- rAF pauses on `visibilitychange` (tab hidden); needsLoop gate stops the loop when idle.

**Result:** a jewel-like, loupe-view movement that genuinely keeps live time, with meshing that
holds under inspection, a real Swiss-lever beat, and four working controls across two themes.
