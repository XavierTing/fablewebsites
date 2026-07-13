# CHROMEHEART 2000 — Iteration Passes

Site: `sites/22-y2k/` — a loving high-craft Y2K revival. Liquid-chrome SVG hero
lettering (turbulence + specular filters), dreamy gradient sky with lens flares
and floating bubbles, gel/aqua nav, era-icon marquee, 6 chrome-artifact cards
with holographic-foil cursor hover, fake animated hit-counter, sparkle cursor
trail, webring links.

Fonts: **Audiowide** (display / chrome wordmark + section heads), **Orbitron**
(techno labels, nav, counter, kickers), **Nunito** (body copy).

Served over local HTTP (`python3 -m http.server`) so the SVG chrome filters
(feTurbulence / feDisplacementMap / feSpecularLighting) resolve reliably in
headless Chromium. Shots at 1440×900, 390×844, and a cards-section mid-scroll.

---

## Pass 1 — baseline critique
Shots: `22-p1-desktop.png`, `22-p1-mobile.png`, `22-p1-cards.png`. Zero console
errors at both widths.

Found:
- **Hero wordmark did NOT read as chrome.** The specular lighting was blowing the
  whole letter out to a puffy WHITE gel/marshmallow with no visible reflective
  banding — the single most important element was failing its brief.
- **Jagged/torn letter edges.** Displacement scale=13 over high-frequency noise
  was tearing the glyph outlines into a distressed/glitch look; liquid chrome
  should be smooth and blobby.
- **Section heading "Artifacts of the Shine Age"** was ghostly/low-contrast
  against the pale sky — legibility problem.
- **Two invalid CSS values** (sloppy, though overridden): `border-radius:el 18px`
  on `.stat`, and `color:#4d5probably` on a duplicate `.counter .comma` rule.

Changed:
- Rebuilt the chrome gradient with a true mirror ramp: deep-navy sky → blue →
  pale sky → white hotspot → **hard dark horizon seam** → blue/lilac ground
  reflection → pink tail.
- Retuned `#chromeFx`: turbulence baseFrequency down to `0.0055 0.013`, octaves
  3→2, displacement scale 13→7 (smooth liquid warp, no tearing), blur 3→1.4 to
  keep the gradient crisp; tamed the two specular passes (lower surfaceScale /
  specularConstant, arithmetic composite k3 1→0.55 and 0.6→0.4) so highlights
  accent instead of erasing the gradient.
- Strengthened the section-head gradient contrast + added a hairline
  `-webkit-text-stroke` and a darker drop-shadow for legibility.
- Removed both invalid CSS values.

## Pass 2 — verify chrome read
Shots: `22-p2-desktop.png`, `22-p2-mobile.png`, `22-p2-cards.png`. Zero console
errors.

Found:
- Wordmark now genuinely reads as liquid chrome — bright polished top, dark
  horizon seam, blue→lilac reflection below. Big win.
- Upper third of the letters still skewed near-white; wanted more visible
  reflected sky-blue for deeper chrome.
- A few residual edge nicks from displacement (subtle, but a couple looked like
  small dents rather than liquid wobble).
- Section heading legible now and cohesively "chrome," matching the wordmark.
- Cards excellent: chrome orb, iridescent holo disc, glossy gel star all reading
  correctly.

Changed:
- Pushed more reflected sky-blue into the upper stops (stronger blue at .07/.18,
  pale-blue at .31) so the top of the glyphs reflects sky rather than blowing white.
- Displacement scale 7→5.5 and blur 1.4→1.6 to clean the remaining edge nicks
  while keeping the liquid wobble.

## Pass 3 — final polish & sign-off
Shots: `22-p3-desktop.png`, `22-p3-mobile.png`, `22-p3-cards.png`. Zero console
errors at both widths.

Result:
- Hero wordmark reads unmistakably as 1999 airbrushed liquid chrome: reflected
  sky-blue upper letters, bright polished band, hard dark horizon seam, blue→lilac
  ground reflection, clean edges. Kerning/composition sharp (textLength-locked
  CHROME/HEART stack).
- Mobile fully composed and intentional (stacked wordmark, gel CTAs, glass nav).
- All six artifact cards render richly; holographic foil hover + gyro spin +
  gel squish intact; glossy gel buttons; nothing flat.
- Verified: 💿 SVG data-URI favicon; `FABLE ×25` fixed back-link → `/`; styled
  scrollbar, `::selection`, `:focus-visible`; counter odometer; webring links.
- Reduced-motion: all heavy motion (hero bob, bubble drift, marquee, flare pulse,
  gyro spin, sparkle cursor trail) is guarded behind
  `prefers-reduced-motion: no-preference` / a `reduced` JS check; the counter
  renders its final value instantly and reveals show immediately — calm by design.

No outstanding issues. Three passes complete.
