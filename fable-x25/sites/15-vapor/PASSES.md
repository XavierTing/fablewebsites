# MALL OF MEMORY™ — Iteration Passes (site 15-vapor)

Vaporwave dreamscape: an infinite deserted mall. Video-loop atrium hero, chrome-gradient
serif title + Japanese subtitle, surreal store directory with RGB-split glitch hover,
statue monument with rotating sun rays, arcade CRT section, generative MALLSOFT FM
WebAudio player, webring footer.

Fonts: **Playfair Display** (chrome-gradient display serif) + **VT323** (mono / signage / terminal).
Served over local HTTP (`localhost:8715`) so the 20 MB `atrium-loop.mp4` hero loads reliably.

---

## Pass 1 — full audit (desktop 1440×900, mobile 390×844, all sections mid-scroll)

Shots: `15-p1-desktop-top`, `15-p1-mobile-top`, `15-p1-directory`, `15-p1-statue`,
`15-p1-arcade`, `15-p1-fm-footer`, `15-p1-arcade-full`, `15-p1-mobile-dir`,
`15-p1-mobile-fm`, `15-p1-grid-hero`, `15-p1-grid-arcade`.

Findings:
- Hero, directory board, statue monument, arcade, FM deck and footer all read as
  intentional, high-craft vaporwave. Chrome-gradient title legible over the atrium video,
  kerning/letterspacing clean, copy is evocative (no lorem). No console errors at either width.
- **BUG (signature element broken):** the four `.grid-strip` neon perspective dividers
  rendered as flat dark bands. The `perspective(280px) rotateX(63deg)` transform on a
  150 px strip collapsed the grid to invisibility, so every section transition read as
  dead space — losing the defining vaporwave neon-grid floor.
- Everything else on Pass 1 was already shippable; the grids were the one real defect.

## Pass 2 — grid dividers rebuilt + regression sweep

Shots: `15-p2-grid-hero`, `15-p2-grid-flip`, `15-p2-flip-centered`, `15-p2-directory`,
`15-p2-arcade-fm`, `15-p2-mobile-grid`.

Changes:
- Rewrote `.grid-strip`: parent `perspective:300px`, a 440 px child plane at
  `rotateX(76deg)` anchored to the strip's bottom edge, cyan depth-lines + pink rails
  (46 px cells), a radial cyan **horizon glow** and top/bottom fade into the sections.
  `.flip` variant anchors to the top with `rotateX(-76deg)` for an inverted **ceiling grid**,
  alternating floor→ceiling→floor→ceiling down the page. `gridFlow` animates the plane
  toward the viewer. Verified: the classic vaporwave grid now renders and the four
  transitions have life instead of dead bands.
- Spotted on mobile: the directory header's Japanese "あなたはここにいます" (YOU ARE HERE)
  was clipped at the right edge (`white-space:nowrap` inside an `overflow:hidden` board).

## Pass 3 — polish + full verification (both widths, reduced-motion, interactivity)

Shots: `15-p3-desktop-top`, `15-p3-mobile-top`, `15-p3-mobile-dir`, `15-p3-mobile-dirhead`,
`15-p3-reduced`, `15-p3-glitch-hover`.

Changes:
- Mobile fix: `.dir-head .youarehere` now wraps (`white-space:normal`, 14 px) at ≤640 px —
  Japanese label fully visible, no clipping.

Verification (all green):
- **Zero console errors** at 1440×900 and 390×844 (normal + reduced-motion).
- **Video hero** plays and loops; **pauses under `prefers-reduced-motion`** and when tab hidden.
- **Reduced-motion** also hides the VHS sweep and freezes title/orbs/rays/grids (confirmed static).
- **MALLSOFT FM**: play toggles the deck to `playing`, picks a random track name, builds the
  WebAudio graph (osc voices + lowpass LFO + feedback delay + tape hiss), `aria-pressed` flips,
  pause fades out and suspends the context. No errors. Pauses on tab-hidden.
- **RGB-split glitch hover** on directory rows confirmed (row highlight + level flips cyan + text ghost-split).
- **Favicon** (inline SVG 🛍️), **FABLE ×25** back-link → `/`, styled scrollbar/selection/focus all present.
- Images (`statue.jpg`, `arcade.jpg`) and the `atrium-loop.mp4` video load via relative paths.
- Note: the rotated full-bleed marquee ribbon extends to ~104 % width by design; `body`
  `overflow-x:hidden` clips it — no horizontal scrollbar appears at either width.
