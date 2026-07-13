# 16-deco — The Meridian Grand · Iteration Passes

## Pass 1 (1440×900 hero + 390×844 hero + hotel + suites)
Found:
- **Hero headline invisible** at both widths. Root cause: `background-clip:text` gradient applied on the `<h1>` while GSAP animated the child `.word` spans — the leftover inline transforms on the spans created compositing layers that broke the parent's text clip, leaving fully transparent glyphs.
- Hero scrim far too dark — the gilded lobby (the whole point of the arrival) barely read.
- Card gold-sheen `::after` peeked at the left edge of triptych cards at rest (skewX extended it into view) — visible diagonal seam on two cards.
- Mobile hero subline wrapped unbalanced ("…MODERN / AGE · NEW ALEXANDRIA").

Changed: moved the gold gradient clip onto each `.word` span + `clearProps:'transform'` after the entrance; lightened both scrim gradients; moved sheen rest position from `left:-70%` to `-110%`; added `text-wrap:balance`.

## Pass 2 (heroes + legend, reserve, footer at 1440; reserve at 390)
Found:
- Headline now renders but **overflows the viewport at 1440** — "THE MERIDIAN GRA…" clipped right (nowrap + oversized clamp 7.2vw/6.1rem with .24em tracking).
- Mobile subline still broke mid-phrase; `text-wrap:balance` insufficient.
- Timeline, telegram card, wax seal, stepped CTA, footer sunburst all composed well; zero console errors.

Changed: display clamp reduced to `clamp(2.2rem, 4.9vw, 4.3rem)` with .2em tracking; split subline into "A Grand Hotel of the Modern Age" + forced-block "New Alexandria" on ≤520px (separator dot hidden).

## Pass 3 (heroes both widths + suites 1440 + hotel/suites/footer/legend at 390)
Found:
- Headline fits with air on both sides at 1440; crest → headline → rule → est. stack reads as one symmetric composition.
- Sheen seam gone; triptych rests clean.
- Mobile: editorial frames, cards, timeline (line re-anchored left at 13px, markers aligned), telegram, CTA and footer all intentional; no overflow, no clipped type.
- Zero console errors at 1440×900 and 390×844 across hero + all `?scroll=` section states.

Changed: nothing further required — pass 3 clean.
