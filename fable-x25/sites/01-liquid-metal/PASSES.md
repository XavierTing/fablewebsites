# PASSES — 01-liquid-metal (MERCURIAL)

## Pass 1 — 1440×900 + 390×844 + #work + #contact scroll states
**Found**
- Blob renders (no console errors) but the material reads as porcelain / dairy-cow, not chrome: the env's ring softbox (×2.5) and broad key light blow out into huge shapeless white patches; no crisp horizon band, no dark/light streaking, so it has none of the mirror language of liquid metal. Priority-one fix.
- Material inconsistency: footer CTA "Let's liquefy" is chrome-gradient text but the hero H1 is flat grey — the two display moments don't speak the same material.
- Hero top-left/left edge is a dead zone at 1440 (all weight sits right + bottom).
- Work list, principles, footer compose well; scroll progress bar + backlink behave.
- Mobile hero composes correctly; blob shares the same material problem.

**Changed**
- Rewrote `env()` as a banded studio sky: razor-hot horizon core (exp falloff ×52) + silver bloom, a dark occluder stripe just below horizon, two thin azimuth-modulated strip lights, zenith cap, tighter/hotter key (pow 90), stronger UV practical — classic streaky chrome reflection content.
- Applied a silver chrome gradient (`background-clip:text`) to the hero H1 letters so hero and footer share one material.
- Added `.hero-side` vertical mono caption ("RAYMARCH N°01 — ONE SHADER, FIVE BODIES") with a UV tick on the left edge, hidden under 900px.

## Pass 2 — 1440×900 + 390×844 hero, #manifesto, #principles, mobile #work
**Found**
- Blob now reads as genuine streaky liquid chrome; hero title material matches; hero-side caption balances the left edge. Console clean at both widths.
- Blob underside is muddy — big flat dark region under the lobes with only the UV spots for relief.
- Top lobe slightly milky where the zenith cap washes in.
- Manifesto at 1440: entire right half is a dead zone (both paragraphs hug the left rail); the `.mute` spans at .26 alpha are borderline illegible even for a whisper effect.
- Principles grid, work list (mobile included) and footer all compose cleanly.

**Changed**
- `env()`: added a faint cool floor sheen for downward directions; reduced zenith cap 0.8 → 0.65.
- Manifesto: second paragraph now steps right (`margin-left:auto`) for a diagonal reading rhythm across the spread (reset on mobile); `.mute` lifted .26 → .34 alpha.

## Pass 3 — 1440×900 + 390×844 hero, #manifesto re-check
**Found**
- Blob underside now carries a violet-silver sheen and reads dimensional at both widths; top-lobe milkiness gone; manifesto diagonal rhythm and lifted `.mute` contrast both land. Console clean at 1440 and 390.
- One stray detail: the scroll-cue's vertical line animates scaleY from the top of its 34px box, so mid-animation it reads as a detached floating tick above the "SCROLL" label.

**Changed**
- Scroll cue line rebuilt horizontal (34×1px, scaleX left→right wipe) so it stays on the label's baseline row at every animation frame.
- Final verification screenshots at 1440×900 and 390×844: composed, zero console errors. Ship.

**Hard-requirement audit (final)**
- Favicon (inline SVG data-URI 🜍) ✓ · title + meta description ✓ · fixed FABLE ×25 backlink to / ✓ · responsive 1440/390 ✓ · zero console errors both widths ✓ · prefers-reduced-motion guards CSS + shader/rAF ✓ · rAF pauses on tab hide + hero offscreen, DPR capped at 2, no raster images ✓.
