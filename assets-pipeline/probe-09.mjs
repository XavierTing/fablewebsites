import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('file:///Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/fable-x25/sites/09-terminal/index.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 2500));
const res = await page.evaluate(() => {
  const c = document.createElement('canvas').getContext('2d');
  c.font = '40px VT323';
  const ref = c.measureText('a').width;
  const glyphs = ['═','║','╔','╗','╚','╝','─','│','┌','┐','└','┘','█','▓','▒','░','¤','*','•','■','·','#','-','|','+','▲','◀',' '];
  const out = {};
  glyphs.forEach(g => out[g] = +(c.measureText(g).width / ref).toFixed(3));
  return { ref, out };
});
console.log(JSON.stringify(res, null, 1));
await browser.close();
