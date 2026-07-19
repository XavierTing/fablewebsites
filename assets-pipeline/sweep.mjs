import puppeteer from 'puppeteer';
const base='https://xavierfable30.netlify.app';
const sites=['','guide/','sites/01-liquid-metal/','sites/02-terrain/','sites/03-cosmos/','sites/04-origami/','sites/05-kinetic-type/','sites/06-brutalist-mag/','sites/07-type-clock/','sites/08-ascii/','sites/09-terminal/','sites/10-synth/','sites/11-ink/','sites/12-fractal/','sites/13-fashion/','sites/14-noir/','sites/15-vapor/','sites/16-deco/','sites/17-flora/','sites/18-annual-report/','sites/19-weather/','sites/20-generative/','sites/21-museum/','sites/22-y2k/','sites/23-teahouse/','sites/24-clay/','sites/25-architecture/','sites/26-vivarium/','sites/27-gravity-poems/','sites/28-sleeper/','sites/29-arcana/','sites/30-orrery/','sites/31-shanshui/','sites/32-karesansui/','sites/33-jianzhi/','sites/34-rain-glass/','sites/35-aurora/','sites/36-slime/','sites/37-bloom/','sites/38-orbits/','sites/39-kaleido/','sites/40-harmonograph/','sites/41-escapement/','sites/42-resonance/','sites/43-foundry/','sites/44-coffee/','sites/45-speakeasy/','sites/46-perfume/','sites/47-cinema/','sites/48-starmap/','sites/49-globe/','sites/50-ocean/','sites/51-zodiac/','sites/52-bazi/','sites/53-iching/','sites/54-kau-cim/','sites/55-horoscope/','sites/56-ziwei/','sites/57-liuyao/','sites/58-meihua/','sites/59-qimen/','sites/60-fengshui/','sites/61-almanac/','sites/62-xiangshu/','sites/63-naming/','sites/64-hehun/','sites/65-dreams/'];
const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--enable-webgl','--use-gl=angle','--ignore-gpu-blocklist']});
let bad=0;
for(const s of sites){
  const p=await b.newPage();
  await p.setViewport({width:1440,height:900,deviceScaleFactor:1});
  const errs=[];
  p.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/favicon/i.test(t))errs.push(t.slice(0,140));}});
  p.on('pageerror',e=>errs.push('PE:'+String(e).slice(0,140)));
  p.on('requestfailed',r=>{const u=r.url();if(!/favicon/i.test(u))errs.push('REQFAIL:'+u.split('/').slice(-2).join('/')+' '+(r.failure()?.errorText||''));});
  try{await p.goto(base+'/'+s,{waitUntil:'networkidle2',timeout:35000});}catch(e){errs.push('NAV:'+e.message.slice(0,80));}
  await new Promise(r=>setTimeout(r,4500));
  const label=s||'(gallery)';
  const uniq=[...new Set(errs)];
  if(uniq.length){bad++;console.log('❌ '+label);uniq.slice(0,5).forEach(e=>console.log('     '+e));}
  else console.log('✅ '+label);
  await p.close();
}
await b.close();
console.log('\n'+(bad?`${bad} route(s) with issues`:'ALL ${sites.length} ROUTES CLEAN — zero console/network errors'));
