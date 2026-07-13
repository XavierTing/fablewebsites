# 28-sleeper — iteration passes

Screenshots in `passes/`, all taken over HTTP (port 8903), zero console errors at every pass, 1440×900 + 390×844.

## Pass 1 — first full build (`28-p1-*.png`)
**Found (merciless art-director read):**
- Fatal water-mask bug: `source-atop` masking on an opaque canvas paints the lake/sea gradient across the full band everywhere → phantom flat stripe through every biome (dusk + station shots).
- Night frame murky and flat: haze mixed layers toward horizon color even at night, night-multiply grade crushed contrast; stars/moon/glitter too faint.
- Mid layer parallax (0.30) spanned almost a whole biome across one screen → the lake could never fill the window; moon glitter landed on a "mountains" sample and was skipped entirely on desktop.
- Station lamp glows were giant fog balls (r=60 + huge platform pools).
- Mid treeline = uniform conveyor-belt row of identical trees on a flat baseline; houses microscopic; big dead flat band between treeline and field.
- "NEXT · 1 KM" wrong after passing a station (negative km clamped to 1).

**Changed:** rewrote water rendering around an offscreen canvas with `destination-in` horizontal mask (glitter drawn inside the mask); BIOME_LEN 4400→5200 and mid parallax 0.30→0.38 with re-tuned scene worldX values; night palette lifted slightly + airglow band above horizon; `layerCol` haze now thins with darkness (silhouettes at night); bigger moon glow; cloud visibility curve steeper at night; lamp glow r=30 with tighter pools; clustered/staggered/size-varied treeline; new far-field layer (par 0.44) to break the dead band; meadow contour bands; bigger houses + fence runs + brighter lit windows; next-station rollover fixed.

## Pass 2 — verify + new finds (`28-p2-*.png`)
**Found:**
- Stray full-width pale line across the night lake: the *sea* mask was sampled with far parallax (0.085), reaching the sea biome 16 km ahead and drawing its horizon-glint line early.
- Needle-thin rock spike in the far ridge (crag noise wavelength too short for that parallax).
- Moon-glitter read as a solid white brick cone — dashes too wide/opaque/regular, guide column too bright.
- Far-field band's bottom edge was a conspicuous ruler-straight tonal break.
- Platform edge line too bright/clinical; night lower third dead-empty.

**Changed:** both water masks now sample at mid parallax; crag noise frequencies halved (0.0011→0.0006, 0.0016→0.0008); glitter rebuilt — broken probabilistic dashes, 3 per row, more jitter, thinner, column alpha down; far-field contrast reduced + sparse hedgerow bushes along its brow to explain the edge; platform edge alpha 0.5→0.28; moonlit sheen ellipse on the near meadow; house density up; nightCol lifted to keep silhouettes readable.

## Pass 3 — full-scene sweep incl. tunnel/day/about (`28-p3-*.png`)
**Found:**
- Tunnel reflection: seat read as a pale floating tombstone box; reflected "window frame" was a crisp 10px line down the middle; figure shoulders looked like a mountain.
- Day scene: sun disc too small/weak at high elevation; clouds too sparse.
- Glitter column still slightly cone-like on mobile; hedgerow blobs sat in a too-even row.
- Station, about section (both widths), and night lake all composed well — kept.

**Changed:** tunnel reflection redesigned — soft gradient corridor-divider sheen instead of a line, seat lowered/darkened (alpha .28), figure rebuilt as a proper head-and-shoulders silhouette with an amber rim-light stroke on the lamp side; sun core radius grows with elevation; cloud density gate 0.35→0.22; glitter column alpha .20→.13 with slightly stronger dashes; hedgerow y-jitter + fewer blobs.

## Pass 4 — final verification (`28-p4-*.png`)
Night (moonpath now soft and broken over the lake), day (composed, airy plains), dusk, station (VELDMARK sign + clock + lamp pools), tunnel (lamp + ghostly rim-lit passenger), mobile night, mobile about — all verified, `NO_CONSOLE_ERRORS` on every shot. No further defects found; shipped.
