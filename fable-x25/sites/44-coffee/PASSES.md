# SLOW POUR — Iteration Passes

Concept: a warm, tactile specialty-coffee roaster — a cosy counterpoint to the collection's
darker/tech pieces. Everything is code-native (CSS + inline SVG + canvas); **no photographs**.
Fonts: **Fraunces** (soft display serif + italics) × **Space Grotesk** (body/UI).
Palette: kraft paper `#f3e9dc`, espresso `#4a2f22`, caramel `#c08a4e`, terracotta accent `#c15a3c`,
sage `#7c8560`.

Sections: illustrated pour-over hero (gooseneck kettle → V60 dripper → glass carafe, animated
steam + liquid-fill + crema) · single-origin bean cards with roast meters · an interactive V60
recipe calculator ("dial in your cup") · a bloom→pour→drawdown ritual animation · a subscription
storefront · a footer with a hanging "Open" hours sign.

Screenshots live in `passes/` (desktop 1440×900, mobile 390×844), captured over local HTTP on :8919.

---

## Pass 1 — full read at both widths

**Reviewed:** hero scene, ribbon marquee, bean cards, brew calculator + recipe ticket + meters,
ritual stage, subscription, footer sign — desktop and mobile.

**Working well:**
- Hero illustration reads beautifully: matte-terracotta gooseneck kettle, ceramic V60, glass
  carafe with a rising coffee level + caramel crema, warm morning-light glow. Pour stream connects
  spout → bed. Zero console errors at both widths.
- Bean cards, italic-Fraunces tasting tags, roast meters, and the kraft "recipe ticket" all land.
- Ritual mini-dripper (bloom bubbles + steam wisps + server fill) and the kraft bag illustration
  look hand-made and warm. Footer hanging sign is charming.

**Problems found:**
1. **Hero steam nearly invisible** — canvas used `mix-blend-mode: screen`; white steam screened
   over a light cream background barely changes any pixels, so the "steam" didn't read.
2. **Strength cup in the calculator looked empty** — the SVG fill-rect y/height was mis-scaled to
   the cup's clip path, so even "Strong" filled only a few px at the very bottom.
3. **Pour count unrealistic** — recipe showed "5 more, steady"; the divisor produced too many
   pours for a V60, and both ternary branches were identical.
4. **Subscription note default mismatch** — static HTML said "Two 250 g bags a month" while the JS
   fortnightly copy said "A 250 g bag a fortnight"; default state was inconsistent.
5. **Mobile nav button wrapped** — "Shop & subscribe" broke to two lines and looked heavy at 390px.
6. **Fixed back-link overlapped the hero CTA on mobile** — hero content overflowed the viewport, so
   "Shop the beans" sat in the bottom-left band where the back-link lives (a real tap-target clash).

---

## Pass 2 — fixes + re-shoot (incl. reduced-motion)

**Changed:**
- **Steam:** removed the screen blend; switched to additive (`lighter`) warm-white wisps with
  higher peak alpha (0.16 → 0.26), softer multi-stop radial falloff, longer life and a taller rise
  from the dripper rim. Now reads as a gentle morning-light column — present but not clip-arty.
- **Strength cup:** remapped fill to the cup interior (`surfY = 39 − strong·28`) so it fills from
  delicate → full correctly.
- **Pours:** `clamp(round((water−bloom)/95), 1, 3)` and honest copy ("3 steady pours" / "one steady
  pour").
- **Subscription:** aligned the default note to the fortnightly (default) state.
- **Mobile nav:** split the label so it collapses to "Shop" ≤480px and hides the "Roastery" tag.
- **Mobile hero:** below 600px, `min-height:auto` + extra bottom padding + slightly smaller scene
  and headline so the CTA sits clear of the back-link.

**Verified (screenshots read):** steam now visible above the dripper; brew meters correct
("Balanced & sweet", extraction marker centred, strength cup half-full); mobile nav compact; mobile
hero CTA clears the back-link. **Reduced-motion** (emulated `prefers-reduced-motion: reduce`): steam
and pour/fill animation off, carafe rests at a static level, sign stops swaying — calm, no errors.

---

## Pass 3 — mobile sweep + interaction/behaviour test

**Reviewed:** mobile beans (single-column stack), mobile brew (dials stack → ticket), mobile ritual
(stage over steps), mobile shop + footer sign. All compose intentionally; no overflow; consistent
warmth and rhythm at 390px.

**Headless interaction test (Puppeteer, both directions of the model):**
- Sliders → strong + fine + hot + long ⇒ Extraction **Over** / Strength **Strong** /
  "Bold & over-extracted"; light + coarse + cool + short ⇒ **Under** / **Delicate** /
  "Bright & under-extracted" — the V60 model reacts correctly and usefully.
- Ritual **Play** auto-advances (stage 1, progress bar ~27% after 4 s) and pauses.
- Subscription frequency (monthly ⇒ £12.00), roast chips, grind chips, and add-to-bag all toggle.
- **NO_CONSOLE_ERRORS** throughout.

**Result:** hero pour + steam read as a genuinely lovely, hand-made illustration; the calculator is
fun *and* useful; motion respects `prefers-reduced-motion`; rAF pauses when hidden / off-screen;
DPR capped at 2. Ship-ready.
