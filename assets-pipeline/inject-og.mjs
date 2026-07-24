// Inject og/twitter share meta into every page (idempotent).
import { readFileSync, writeFileSync, existsSync } from 'fs';

const ROOT = '/Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/fable-x25';
const SITE = 'https://xavierfable30.netlify.app';
const slugs = ['01-liquid-metal','02-terrain','03-cosmos','04-origami','05-kinetic-type','06-brutalist-mag','07-type-clock','08-ascii','09-terminal','10-synth','11-ink','12-fractal','13-fashion','14-noir','15-vapor','16-deco','17-flora','18-annual-report','19-weather','20-generative','21-museum','22-y2k','23-teahouse','24-clay','25-architecture','26-vivarium','27-gravity-poems','28-sleeper','29-arcana','30-orrery','31-shanshui','32-karesansui','33-jianzhi','34-rain-glass','35-aurora','36-slime','37-bloom','38-orbits','39-kaleido','40-harmonograph','41-escapement','42-resonance','43-foundry','44-coffee','45-speakeasy','46-perfume','47-cinema','48-starmap','49-globe','50-ocean','51-zodiac','52-bazi','53-iching','54-kau-cim','55-horoscope','56-ziwei','57-liuyao','58-meihua','59-qimen','60-fengshui','61-almanac','62-xiangshu','63-naming','64-hehun','65-dreams','66-parfumeur','67-incense','68-metro','69-thock','70-marbling'];

const pages = [
  { file: `${ROOT}/index.html`, path: '/' },
  { file: `${ROOT}/guide/index.html`, path: '/guide/' },
  ...slugs.map(s => ({ file: `${ROOT}/sites/${s}/index.html`, path: `/sites/${s}/` })),
];

const esc = s => s.replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/"/g, '&quot;');

for (const pg of pages) {
  let html = readFileSync(pg.file, 'utf8');
  if (html.includes('property="og:title"')) { console.log('SKIP (has og)', pg.path); continue; }
  const title = (html.match(/<title>([^<]+)<\/title>/) || [,'XAVIER FABLE ×70'])[1].trim();
  const desc = (html.match(/<meta\s+name="description"\s+content="([^"]+)"/) || [,''])[1].trim()
    || 'Part of XAVIER FABLE ×70 — seventy websites designed and built autonomously by Claude Fable 5.';
  const img = `${SITE}${pg.path}assets/og.jpg`;
  if (!existsSync(pg.file.replace(/index\.html$/, 'assets/og.jpg'))) console.log('WARN no og.jpg for', pg.path);
  const block = `
<meta property="og:type" content="website">
<meta property="og:site_name" content="XAVIER FABLE ×70">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${SITE}${pg.path}">
<meta property="og:image" content="${img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${img}">`;
  // insert right after the description meta (or after <title> if none)
  if (/<meta\s+name="description"[^>]*>/.test(html)) {
    html = html.replace(/(<meta\s+name="description"[^>]*>)/, `$1${block}`);
  } else {
    html = html.replace(/(<\/title>)/, `$1${block}`);
  }
  writeFileSync(pg.file, html);
  console.log('OG-META', pg.path, '—', title.slice(0, 50));
}
console.log('DONE');
