#!/usr/bin/env node
// Drive the karesansui garden: script a rake stroke / test reduced-motion.
// usage: node _rake-kare.mjs <url> <out.png> [w] [h] [mode] [waitMs]
import puppeteer from 'puppeteer';

const [url, out, w='1440', h='900', mode='rake', waitMs='2600'] = process.argv.slice(2);
const W=+w, H=+h;
const browser = await puppeteer.launch({ headless:'new', args:['--no-sandbox','--enable-webgl','--use-gl=angle'] });
const page = await browser.newPage();
await page.setViewport({ width:W, height:H, deviceScaleFactor:1 });
const errors=[];
page.on('console', m=>{ if(m.type()==='error') errors.push(m.text().slice(0,300)); });
page.on('pageerror', e=>errors.push('PAGEERROR: '+String(e).slice(0,300)));
if(mode==='reduced'){ await page.emulateMediaFeatures([{name:'prefers-reduced-motion', value:'reduce'}]); }
await page.goto(url, { waitUntil:'networkidle2', timeout:30000 });
await new Promise(r=>setTimeout(r, +waitMs));

async function stroke(pts){
  await page.mouse.move(pts[0].x, pts[0].y);
  await page.mouse.down();
  for(let s=1;s<pts.length;s++){
    const a=pts[s-1], b=pts[s];
    const steps=Math.max(6, Math.round(Math.hypot(b.x-a.x,b.y-a.y)/6));
    for(let i=1;i<=steps;i++){ const t=i/steps; await page.mouse.move(a.x+(b.x-a.x)*t, a.y+(b.y-a.y)*t); }
  }
  await page.mouse.up();
}
function arc(cx,cy,r,a0,a1,n=44){ const p=[]; for(let i=0;i<=n;i++){ const a=a0+(a1-a0)*i/n; p.push({x:cx+Math.cos(a)*r, y:cy+Math.sin(a)*r}); } return p; }

if(mode==='rake'){
  await stroke([{x:W*0.06,y:H*0.16},{x:W*0.5,y:H*0.19},{x:W*0.94,y:H*0.15}]);
  await stroke([{x:W*0.08,y:H*0.7},{x:W*0.5,y:H*0.64},{x:W*0.82,y:H*0.72}]);
  // straight stroke driven at the top-right stone: tines bend around it
  await stroke([{x:W*0.60,y:H*0.02},{x:W*0.60,y:H*0.46}]);
  // arc sweeping past the same stone
  await stroke(arc(W*0.60, H*0.33, 150, -Math.PI*0.85, Math.PI*0.25));
  await new Promise(r=>setTimeout(r, 400));
}

await page.screenshot({ path: out });
await browser.close();
console.log('SHOT', out, '('+mode+')');
if(errors.length){ console.log('CONSOLE_ERRORS('+errors.length+'):'); [...new Set(errors)].slice(0,8).forEach(e=>console.log(' -',e)); }
else console.log('NO_CONSOLE_ERRORS');
