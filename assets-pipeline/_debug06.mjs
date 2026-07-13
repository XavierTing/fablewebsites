import puppeteer from 'puppeteer';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('file:///Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/fable-x25/sites/06-brutalist-mag/index.html', { waitUntil: 'networkidle2' });
await new Promise(r => setTimeout(r, 4000));
const info = await page.evaluate(() => {
  const r = el => { const b = el.getBoundingClientRect(); return { left: +b.left.toFixed(1), right: +b.right.toFixed(1), width: +b.width.toFixed(1), height: +b.height.toFixed(1) }; };
  const pullcol = document.querySelector('.pullcol');
  return {
    viewport: innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    pullcol: r(pullcol),
    pulls: [...document.querySelectorAll('.pull')].map(r),
    masts: [...document.querySelectorAll('.mast.fit .fitspan')].map(r),
    prose: r(document.querySelector('.prose')),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
