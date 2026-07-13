# NOX BOTANICA — iteration passes

## Pass 1 (1440×900: hero / plate-2 / map / visiting; 390×844 attempted)
Found:
- Hero overline ("The Conservatory... Est. 1861") nearly illegible over the bright mid-band of foliage; subtitle also thin.
- Plate bloom worked, but the specimen-colored glow was too timid (max opacity .34, no colored shadow on the frame) — plates read as "framed photo", not "bioluminescent specimen sheet".
- Scroll progress bar: full-width 5-color rainbow at 85% opacity read as gaudy against the restrained palette.
- Night map: all beds tinted generic jade — brief asks each bed to carry its specimen's color; markers had no glow at rest.
- Mobile screenshot collided with a parallel build using the same generic filename in the shared scratchpad — mobile unverified this pass.
Changed:
- Dark text-shadows + lighter ink on hero overline/subtitle.
- Plate glow max opacity .34→.50, blur 46→56px; lit frames now get an accent border (45%) + outer/inner accent box-shadow.
- Progress bar opacity .85→.45.
- Map beds tinted per-specimen via --b custom property; markers get a resting drop-shadow(currentColor).
- Unique screenshot filenames (flora17-*) from now on.

## Pass 2 (1440×900 hero / plate-3 mid-scroll / night map; 390×844 hero — shots in passes/17-p2-*.png, zero console errors at all four)
Found:
- Hero video (assets/hero-loop.mp4, pulsing glasshouse) confirmed in place with poster + muted autoplay loop playsinline; desktop hero composes beautifully, but "EST. 1861" in the overline crosses the hot lantern band — marginal legibility.
- Mobile hero overline wraps to two cramped lines at .42em tracking ("...IMPOSSIBLE / FLORA · EST. 1861"), ragged and tight against the title.
- Plate bloom: inside the frame the specimen glows, but the halo OUTSIDE the frame still reads as a thin colored border + timid shadow — not a bloom.
- Night map: "Lantern Gate" label strikes through the gate circle; markers only brighten on hover (no growth), feel inert for "touch a light" copy.
Changed:
- Hero veil bottom radial deepened (.92@12%→.94@18%, 55%→60% falloff) to seat the overline.
- ≤480px overline: 9px, .3em tracking, line-height 1.9, text-wrap:balance, max-width 30ch.
- Lit plate frame: border 45%→52%, twin outer shadows (110px −12px @46% + 34px @26%), inset up to 34%; JS glow max opacity .50→.62.
- Lantern Gate label re-anchored (text-anchor=end, x=414) clear of the circle; markers now scale 1.22 on hover/focus with sprung ease alongside the stronger drop-shadow.

## Pass 3 (1440×900 hero / plate-2 / map + 390×844 hero / plate-4 mid-scroll — shots in passes/17-p3-*.png, zero console errors at all five)
Found:
- Pass-2 fixes confirmed: amber bloom now radiates well past the lit frame on desktop, jade bloom reads on mobile too; mobile overline balances into three clean centered lines; Lantern Gate label sits clear of the gate circle; hero overline seated by the deeper veil.
- One typographic flaw left: the 1.6em accent ::first-letter inflated the first line box of every plate note, opening a visible gap between lines 1–2 of the paragraph.
Changed:
- ::first-letter gets line-height:.85 — first-line rhythm now matches the rest of the paragraph (re-shot plate-2 to confirm, passes/17-p3-plates-final.png).
Verified (hard requirements):
- Favicon: inline SVG data-URI moon emoji. Back-link: fixed top-left "FABLE ×25" → "/". Zero console errors across all 9 pass-2/3 shots (both widths, mid-scroll, map).
- prefers-reduced-motion emulated in headless Chrome: hero video paused with autoplay stripped, hero copy + .fade blocks fully visible (opacity 1), scroll-behavior auto, motes/orb loop not started, no errors.
- Cursor orb/dot: pointer:fine + no-reduced-motion gated, plate/marker accent-color aware — code-reviewed (not capturable headless).
