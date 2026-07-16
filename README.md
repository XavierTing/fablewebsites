# XAVIER FABLE ×50

**Fifty fundamentally different websites — designed, written, art-directed and built end-to-end by Claude Fable 5, autonomously.**

🔗 **Live:** https://xavierfable30.netlify.app · 📖 **The guide:** https://xavierfable30.netlify.app/guide/

Each site is a self-contained demonstration of a distinct web-design technique — raymarched GLSL chrome, a hand-rolled fluid simulation, a playable terminal OS, a real Keplerian orrery, generative art, cinematic AI imagery, kinetic type, and more — every one taken through **three hostile self-critique passes** (headless screenshot → read → fix) before shipping.

## Structure

```
fable-x25/                  # the site (deployed to Netlify, no build step)
├── index.html              # gallery homepage — a "living wall" of all 50 thumbnails
├── guide/index.html        # how it was made
└── sites/
    ├── 01-liquid-metal/     # MERCURIAL — raymarched liquid-chrome (custom GLSL)
    ├── 02-terrain/          # ALTIVA — procedural Three.js mountain flyover
    ├── …                    # (50 sites total)
    └── 30-orrery/           # EPHEMERIS — a working Keplerian orrery
    #   each: index.html + assets/ + PASSES.md (the 3-pass critique log)

assets-pipeline/            # the tooling that built it
├── gen-image.mjs / gen-batch.mjs   # GPT Image (gpt-image-2) asset generation
├── gen-video.mjs                   # Kling image-to-video via fal.ai
├── shot.mjs / scrollshot.mjs       # headless screenshot capture (Puppeteer)
├── sweep.mjs                       # live console/network error sweep of every route
└── ogshots.mjs / inject-og.mjs     # per-page social share cards + meta
```

## The 50

**3D & WebGL** — Mercurial · Altiva · Heliopause · Fold  
**Typography** — The Elastic Word · Raw Matter · Meridiem · Phosphor  
**Motion** — Fable-DOS · Lumen · Sumi · Deeper  
**Cinematic** — Vantablume · The Long Sleep · Mall of Memory · The Meridian Grand · Nox Botanica  
**Data & systems** — Atlas Water Authority · Nephology · Ephemera · Musæum of Lost Things  
**Retro & play** — Chromeheart 2000 · Kōcha-an · Dough · Mass & Void  
**Wave II** — Vivarium · Gravity Well · The Sleeper · Arcana · Ephemeris  
**Wave III** — 山水 Shan Shui · 枯山水 Karesansui · 剪纸 Jianzhi · Rain on Glass · Aurora  
**Wave IV** — Physarum · Morphogen · N-Body · Kaleido · Harmonograph · Escapement · Resonance · Cold Set (type foundry) · Slow Pour (coffee) · The Brass Owl (bar) · Olfacta (perfume) · The Lumen (cinema) · Uranometria (star atlas) · Meridian (globe) · Further (ocean)

## Running locally

Every page is hand-written HTML/CSS/JS with no build step. To preview:

```bash
cd fable-x25
python3 -m http.server 8899
# open http://localhost:8899
```

The tooling in `assets-pipeline/` needs its own deps (`npm install` there for Puppeteer / ffmpeg-static) and API keys (OpenAI for images, fal.ai for video) supplied via environment — none are committed.

## Notes

- Asset generation used GPT Image (`gpt-image-2`) for stills and **Kling via fal.ai** for the three motion loops.
- Raw generated source assets, `node_modules`, and the raw per-pass screenshots are `.gitignore`d for size; the compressed assets each site actually loads are committed, and every site's written critique log (`PASSES.md`) is kept.

Built with [Claude Code](https://claude.com/claude-code).
