# MERIDIAN — Iteration Passes (49-globe)

Concept: "MERIDIAN — the connected world." A mission-control WebGL data-globe of the
physical internet. Stylized dot-matrix Earth (point cloud masked to hand-authored
coastline polygons, no photo texture), luminous great-circle arcs between ~28 exchange
cities with travelling pulses, fresnel atmosphere, day/night terminator, drag-spin with
momentum, scroll-zoom, hover-to-trace, and an auto-route engine. Below the fold: sections
on great-circle geometry + the submarine-cable internet + footer.

Stack: Three.js 0.160 (module import). Fonts: Space Grotesk (display) + IBM Plex Mono (HUD/coords).
Palette: space-navy #060a16, cyan/teal land + rings, warm amber priority arcs.

Screenshots served over http://localhost:8924 and shot with assets-pipeline/shot.mjs
(reduced-motion verified with an emulateMediaFeatures variant). DPR capped at 2, rAF pauses
on tab-hidden and when the hero scrolls out of view.

---

## Pass 1 — first render (49-p1-*)
Verified the globe, land dots, arcs, rings and HUD all render (not blank), zero console errors
at 1440×900 and 390×844.

Found:
- **Atmosphere was a huge cartoonish blue "donut"** — the backside fresnel sphere was too
  large (R×1.16) and too strong (0.9), dominating the whole frame.
- Land dots too dim — continents barely readable against the navy sphere.
- Hero framed the empty Indian Ocean; not an iconic face.
- Hero tagline text was low-contrast sitting over the dot field.

Changed:
- Rebuilt atmosphere: R×1.075, strength 0.62, falloff exp 5.2, plus a thin bright inner limb ring.
- Brightened land dots (day #82f2ff, bigger point size) and raised the terminator floor.
- Rotated the globe to feature the Atlantic (Americas ↔ Europe/Africa) on desktop.
- Added strong multi-layer text-shadow to the hero title; pulled the camera back for breathing room.

## Pass 2 — legibility, motion & framing (49-p2-*, 49-p3-zoom-hover)
Found:
- Globe now reads well, but the **night hemisphere went empty/dark** (ocean + shadow) — the
  face looked half-populated, especially cramped in portrait/mobile.
- Travelling pulses were a touch thin; wanted more of a comet head + trail.
- Needed a repeatable way to capture a zoomed/rotated + hover-highlight state.

Changed:
- Added a "city-lights at night" look: raised the night-side dot floor and brightened the
  night tone so land stays visible across the whole globe while keeping day/night contrast;
  nudged the sun more frontal.
- Beefed up the arc pulse (comet head + trailing glow), thicker core/glow tubes.
- Gave mobile its own land-dense initial rotation (Africa/Europe/Mideast) and larger dots.
- Implemented `?y=&x=&z=&hover=&scroll=` query params to deterministically capture states.
- Verified hover readout (New York → links 4, cables 3, latency 9ms) with connected arcs
  highlighted and the rest dimmed to context.

## Pass 3 — scroll handoff & final polish (49-p3-*)
Found:
- **Fixed HUD panels + hero title + city labels stayed pinned over the scrolling content**,
  and the content's transparent top let the live globe bleed through the section headings —
  cluttered transition.
- Mobile still slightly sparse at some rotations.

Changed:
- Made `.content` background opaque and hid the HUD via a scroll-position threshold (30% vh)
  instead of intersection — the globe's upper curve now cleanly crowns section 01, then text
  flows on solid navy with the HUD faded out.
- Confirmed reduced-motion path (emulated): static globe with all arcs drawn as continuous
  glowing curves, no spin, no auto-route, route toggle shown disabled.
- Confirmed stat count-ups, route table, and footer wordmark render crisply; back-link reads
  "XAVIER FABLE ×50" and links to `/`.

Result: zero console errors at both widths; premium mission-control data-globe with crisp
stylized land, true great-circle arcs, travelling pulses, atmosphere, day/night and full
interaction. Shots: 49-p3-desktop, 49-p3-mobile, 49-p3-zoom-hover, 49-p3-sec01, 49-p3-content,
49-p3-content-mobile, 49-p3-footer, 49-p3-reduced.
