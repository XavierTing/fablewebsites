// Capture 1200x630 og:image screenshots for every page, served over local HTTP.
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { execSync } from 'child_process';

const ROOT = '/Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/fable-x25';
const BASE = 'http://localhost:8899';
const slugs = ['31-shanshui','32-karesansui','33-jianzhi','34-rain-glass','35-aurora'];
// per-site extra query params so the shot shows the site "alive"
const params = { '10-synth':'?awake=1', '27-gravity-poems':'?ch=1&settle=1', '28-sleeper':'?scene=dusk', '29-arcana':'?state=drawn&flip=3', '33-jianzhi':'?unfolded=1&preset=fu', '31-shanshui':'?x=6500' };
const waits  = { '09-terminal':7000, '20-generative':6500, '11-ink':6000, '04-origami':5000, '26-vivarium':6000, '27-gravity-poems':6000, '28-sleeper':6000, '29-arcana':5000, '30-orrery':5000, '31-shanshui':5000, '32-karesansui':5000, '33-jianzhi':4500, '34-rain-glass':5500, '35-aurora':5000 };

const pages = [
  { url: '/', png: ROOT + '/assets/og.png', dir: ROOT + '/assets' },
  { url: '/guide/', png: ROOT + '/guide/assets/og.png', dir: ROOT + '/guide/assets' },
  ...slugs.map(s => ({ url: `/sites/${s}/${params[s]||''}`, png: `${ROOT}/sites/${s}/assets/og.png`, dir: `${ROOT}/sites/${s}/assets`, wait: waits[s] })),
];

const b = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--enable-webgl','--use-gl=angle'] });
for (const pg of pages) {
  mkdirSync(pg.dir, { recursive: true });
  const p = await b.newPage();
  await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  try { await p.goto(BASE + pg.url, { waitUntil: 'networkidle2', timeout: 30000 }); } catch (e) { console.log('NAV-WARN', pg.url, e.message.slice(0,60)); }
  await new Promise(r => setTimeout(r, pg.wait || 4200));
  await p.screenshot({ path: pg.png });
  // convert to jpg (smaller) via sips, keep as og.jpg
  const jpg = pg.png.replace(/\.png$/, '.jpg');
  execSync(`sips -s format jpeg -s formatOptions 82 "${pg.png}" --out "${jpg}" >/dev/null 2>&1 && rm "${pg.png}"`);
  console.log('OG', pg.url);
  await p.close();
}
await b.close();
console.log('DONE');
