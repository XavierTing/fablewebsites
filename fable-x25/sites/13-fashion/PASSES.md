# 13-fashion — VANTABLUME iteration passes

## Pass 1 (1440 hero, 390 hero, desktop scroll 28% / 62% / 85%)
Found:
- Desktop header nav ("The House", "Credits") nearly illegible over the hero's bright light beam — mix-blend-mode: difference landing on mid-gray.
- Mobile header broken: "FABLE ×25" wrapped to two lines and collided with the nav links.
- Runway alternation used `:nth-child`, which counted `.runway-head` as child 1 and inverted the intended odd/even layout.
Changed:
- Header labels set to weight 500 + `white-space: nowrap`; hero top scrim deepened (0.35 → 0.6).
- Mobile header: 9px labels, tighter tracking, nav reduced to Collection + Enquiries, season hidden.
- Switched alternation to `article:nth-of-type` (explicit, look 01 media left).

## Pass 2 (1440 + 390 heroes, desktop scroll 15% / 97%, mobile scroll 30% / 95%)
Found:
- Runway, detail-quote, manifesto, credits, and footer all composed correctly at both widths; contrast reveal and parallax firing.
- Only remaining nit: "The House" / "Credits" nav links still a touch dimmer than siblings directly over the beam's brightest spot.
Changed:
- Top scrim deepened once more (0.6 → 0.78, feathered to 24%) so blend-difference resolves to near-ivory across the whole strip.

## Pass 3 (1440 hero re-verified, 390 hero, desktop scroll 45%, mobile scroll 55% / 78%)
Found:
- One screenshot captured a different concurrent build's page (shared shot tool race) — re-shot; not a site bug.
- All previous findings resolved: nav uniformly legible, look 03 panel and mobile manifesto clean, baked-in wordmark in hero footage fully cropped at both widths.
- Zero console errors on every shot at 1440×900 and 390×844.
Changed: nothing further required.
