# FOLD — iteration passes

## Pass 1 — 1440×900 + 390×844 + mid-scroll (?scroll=works, ?scroll=workshops)

Found (art-director critique of screenshots):
- Hero crane floated far too high above its ground shadow (~140px air gap) and read small in the stage; large dead zone between crane and caption.
- Facet shading too flat — the crane leaned "vector logo" rather than 3D paper; gradient deltas and diffuse range too narrow.
- Works cards: mini crane tiny (scale .62) and hovering high above its mini-shadow; big dead space right of the text column on 1440.
- `?scroll=` jump screenshots caught reveal transitions mid-flight and the Fune card rendered as an empty cream box (w-fold never/late triggered after instant jump) — non-deterministic reveal state.
- Hero crane wingspan (~474px at scale 1.5) would overflow the 390px viewport.
- Zero console errors at both widths. Favicon, FABLE ×25 link, title/meta all present.

Changed:
- Raised stage shadow (bottom 9%→17%, tightened width), lowered turntable to top 55%, reduced float bob amplitude, hero scale now responsive: `min(1.65, max(1.05, innerWidth/380))`.
- Widened palette lo/hi ranges per colour and strengthened facet gradient (±6/−5) for stronger paper-facet contrast.
- Mini specs re-scaled: crane .62→.82 (top 55%), fox 1.15→1.5, boat 1.15→1.5; mini-shadow raised to bottom 16%, widened to 58%.
- Works layout now alternates stage left/right per card (nth-of-type even) to kill dead space and add editorial rhythm; resets to single column under 900px.
- `?scroll=` handler force-settles all `.reveal`/`.work` states before jumping (deterministic screenshots, no half-folded glitch); IO threshold .18→.12 for tall cards under fast scroll.

## Pass 2 — 1440×900 + 390×844 + ?scroll=works / 1600 / workshops + mobile mid-scroll

Found:
- Hero much stronger: crane reads as faceted 3D paper now, but still ~100px of air between crane and drop shadow.
- `?scroll=1600` shot caught the page mid-smooth-scroll with reveals mid-transition — `html{scroll-behavior:smooth}` animates the programmatic jump, so the "instant" jump crawled in headless.
- Mobile works card header wrapped messily at 390px ("Orizuru / 折鶴" broken across lines, paper spec crammed right).
- Mobile hero: first viewport is type-only; crane only teased as clipped wing tips colliding visually with the FABLE ×25 chip.
- Workshops table composed well; kanji column and status chips read nicely. Alternating card layout confirmed on card 001 side.

Changed:
- Turntable top 55%→57%, stage shadow bottom 17%→19% — crane now hovers just above its shadow.
- `?scroll=` handler forces `scroll-behavior:auto` before jumping.
- Mobile: `.w-top` wraps with paper-spec moved to its own full-width row; card padding tightened; hero padding-top 130→112, h1/lede margins trimmed, stage 440→400px so the crane enters the frame sooner.

## Pass 3 — 1440×900 + 390×844 + ?scroll=works / workshops + mobile mid-scroll (screenshots in passes/)

Found:
- CRITICAL: hero crane, ground shadow AND stage caption all missing from the 1440×900 full-viewport capture — right column pure blank. DOM probe showed opacity:1 and 22 facets present; clipped-region captures rendered fine. Bisect proved the culprit: the fill-forwards `fadeUp` entrance on `.hero-stage` keeps the element on a persistently-animating composited layer whose preserve-3d contents the full-surface rasterizer drops (killing the rAF tilt loop did NOT fix it; removing the stage animation or pausing the infinite spin did).
- Crane still hovered ~110px above its ground shadow — "levitating", not "resting above the sheet".
- `.scroll-hint` ("UNFOLD", left 64px / bottom 26px) collides with the fixed FABLE ×25 chip (spans x 22–126): label hidden beneath the chip, only the orphaned drop-line visible.
- Works cards (001 crane mid-scroll, mobile card): mini crane grounded on its shadow, fold reveal glitch-free with ?scroll= settling; workshops table, chips and kanji column compose cleanly. Zero console errors at both widths.

Changed:
- JS settles the hero-stage entrance: on `animationend` (plus 2.4s fallback) sets `opacity:1; animation:none`, releasing the composited layer — crane now renders in full captures and drops one always-active animation.
- Grounding: `.stage-shadow` bottom 19%→26%, hero turntable top 57%→61.5% — hover gap ~110px→~35px.
- `.scroll-hint` raised to bottom 96px (clear of the chip); hidden under 800px viewport height so it can't collide with the CTA row on short laptops.

## Pass 4 — verification: 1440×900 + 390×844 + ?scroll=3500 (Kitsune/Fune) + ?scroll=4400 (Fune/Workshops) + reduced-motion emulation

Found:
- Hero crane now renders in full-viewport captures at 1440×900: faceted paper body, sumi beak, shadow directly beneath (~45px hover with the bob), caption and UNFOLD hint all composed. Mobile 390×844 unchanged and intentional (type-first, crane entering at the fold).
- Kitsune card: fox mask reads clearly (blush inner ears, indigo nose), grounded on its mini-shadow, alternating stage-right layout correct. Fune: indigo hull + cream sail correct, no fold glitches at jumped scroll positions.
- Reduced-motion emulation at 1440×900: crane fully visible as a static object (pixel-checked), no entrance dependence.
- Zero console errors at both widths on every screenshot. Favicon (折 SVG data-URI), title + meta description, fixed FABLE ×25 chip + footer gallery link all present.

Changed: nothing — pass clean, stopping here.

