// Capture 1200x630 og:image screenshots for every page, served over local HTTP.
import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { execSync } from 'child_process';

const ROOT = '/Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/fable-x25';
const BASE = 'http://localhost:8899';
const slugs = ['01-liquid-metal','02-terrain','03-cosmos','04-origami','05-kinetic-type','06-brutalist-mag','07-type-clock','08-ascii','09-terminal','10-synth','11-ink','12-fractal','13-fashion','14-noir','15-vapor','16-deco','17-flora','18-annual-report','19-weather','20-generative','21-museum','22-y2k','23-teahouse','24-clay','25-architecture','26-vivarium','27-gravity-poems','28-sleeper','29-arcana','30-orrery','31-shanshui','32-karesansui','33-jianzhi','34-rain-glass','35-aurora','36-slime','37-bloom','38-orbits','39-kaleido','40-harmonograph','41-escapement','42-resonance','43-foundry','44-coffee','45-speakeasy','46-perfume','47-cinema','48-starmap','49-globe','50-ocean','51-zodiac','52-bazi','53-iching','54-kau-cim','55-horoscope','56-ziwei','57-liuyao','58-meihua','59-qimen','60-fengshui','61-almanac','62-xiangshu','63-naming','64-hehun','65-dreams','66-parfumeur','67-incense','68-metro','69-thock','70-marbling'];
// per-site extra query params so the shot shows the site "alive"
const params = { '10-synth':'?awake=1', '27-gravity-poems':'?ch=1&settle=1', '28-sleeper':'?scene=dusk', '29-arcana':'?state=drawn&flip=3', '33-jianzhi':'?unfolded=1&preset=fu', '31-shanshui':'?x=6500', '37-bloom':'?preset=coral', '39-kaleido':'?sym=12&palette=jewel', '40-harmonograph':'?done=1', '42-resonance':'?demo=1', '45-speakeasy':'?entered=1', '46-perfume':'?scent=2', '47-cinema':'?titledone=1', '48-starmap':'?center=orion&lines=1', '50-ocean':'?time=golden', '51-zodiac':'?year=1990', '52-bazi':'?date=1990-05-20&time=14:30', '53-iching':'?hex=1', '54-kau-cim':'?revealed=1&seed=7', '55-horoscope':'?sign=leo', '56-ziwei':'?date=1990-05-20&time=14:30&sex=f', '57-liuyao':'?lines=776896&type=career', '58-meihua':'?a=10&b=3', '59-qimen':'?datetime=2026-07-20T14:30', '60-fengshui':'?facing=S&period=8', '61-almanac':'?date=2026-07-20', '62-xiangshu':'?zone=nose', '63-naming':'?name=王力宏', '64-hehun':'?a=1990-05-20&b=1992-08-14', '65-dreams':'?q=掉牙', '66-parfumeur':'?accord=ambre', '67-incense':'?lit=1', '68-metro':'?state=rush', '69-thock':'?colorway=tang&typed=1', '70-marbling':'?pattern=nonpareil' };
const waits  = { '09-terminal':7000, '20-generative':6500, '11-ink':6000, '04-origami':5000, '26-vivarium':6000, '27-gravity-poems':6000, '28-sleeper':6000, '29-arcana':5000, '30-orrery':5000, '31-shanshui':5000, '32-karesansui':5000, '33-jianzhi':4500, '34-rain-glass':5500, '35-aurora':5000, '36-slime':5500, '37-bloom':5500, '38-orbits':5500, '39-kaleido':4500, '40-harmonograph':6500, '41-escapement':4500, '42-resonance':4500, '46-perfume':5000, '48-starmap':4500, '49-globe':5000, '50-ocean':5000, '51-zodiac':4500, '52-bazi':4500, '54-kau-cim':4500, '55-horoscope':4500, '66-parfumeur':5000, '67-incense':5500, '68-metro':5000, '69-thock':4500, '70-marbling':5000 };

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
