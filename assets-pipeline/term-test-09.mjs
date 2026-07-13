#!/usr/bin/env node
// FABLE-DOS functional test + screenshot harness.
// Usage: node term-test.mjs <file> <outDir> <prefix>
import puppeteer from 'puppeteer';

const [target, outDir, prefix = '09-p1'] = process.argv.slice(2);
const url = target.startsWith('http') ? target : 'file://' + target;
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });

const errors = [];
function wire(page) {
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));
}
const sleep = ms => new Promise(r => setTimeout(r, ms));
const results = [];
function check(name, ok, detail = '') { results.push(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ' — ' + detail : ''}`); }

// ---------- DESKTOP ----------
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
wire(page);
const t0 = Date.now();
await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

// 1. mid-boot shot
await sleep(1300);
await page.screenshot({ path: `${outDir}/${prefix}-boot.png` });

// 2. wait for prompt + auto-typed help output
let bootMs = -1;
try {
  await page.waitForFunction(
    () => document.getElementById('out').innerText.includes('FABLE-DOS SHELL') &&
          document.getElementById('promptLine').classList.contains('on'),
    { timeout: 15000 });
  bootMs = Date.now() - t0;
} catch (e) { check('boot->help prompt', false, e.message); }
check('boot completes + help auto-typed', bootMs > 0, `prompt ready ${bootMs}ms after nav`);
await sleep(400);
await page.screenshot({ path: `${outDir}/${prefix}-help-desktop.png` });

async function type(cmd) {
  await page.keyboard.type(cmd, { delay: 12 });
  await page.keyboard.press('Enter');
  await sleep(250);
}
const outText = () => page.evaluate(() => document.getElementById('out').innerText);

// 3. cat a file
await type('cat poems/dawn.txt');
let t = await outText();
check('cat poems/dawn.txt', t.includes('the night shift ends'));

// 4. unknown command
await type('frobnicate');
t = await outText();
check('unknown command error', /frobnicate/.test(t) && /(Bad command|not recognized|SYNTAX ERROR|No such command|makes no mention)/.test(t));

// 5. tab completion
await page.keyboard.type('wh', { delay: 10 });
await page.keyboard.press('Tab');
await sleep(150);
let typed = await page.evaluate(() => document.getElementById('typed').textContent);
check('tab completion wh->whoami', typed.trim() === 'whoami');
await page.keyboard.press('Enter'); await sleep(200);

// 6. history recall
await page.keyboard.press('ArrowUp'); await sleep(120);
typed = await page.evaluate(() => document.getElementById('typed').textContent);
check('history ArrowUp recalls whoami', typed === 'whoami');
await page.keyboard.press('Escape'); // no-op in shell
await page.keyboard.down('Control'); await page.keyboard.press('c'); await page.keyboard.up('Control');
await sleep(150);

// 7. theme amber
await type('theme amber');
const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
check('theme amber switches', theme === 'amber');
await sleep(300);
await page.screenshot({ path: `${outDir}/${prefix}-amber.png` });

// 8. matrix
await type('matrix');
await sleep(1800);
const fxOn = await page.evaluate(() => document.getElementById('screen').classList.contains('fx-on'));
check('matrix canvas visible', fxOn);
await page.screenshot({ path: `${outDir}/${prefix}-matrix.png` });
await page.keyboard.press('Space'); await sleep(300);
const fxOff = await page.evaluate(() => !document.getElementById('screen').classList.contains('fx-on'));
check('matrix exits on keypress', fxOff);

// 9. theme back to green, snake
await type('theme green');
await type('snake');
await sleep(600);
const grid1 = await page.evaluate(() => {
  const pres = document.querySelectorAll('#out pre');
  return pres.length ? pres[pres.length - 1].textContent : '';
});
check('snake grid renders', grid1.includes('╔') && grid1.includes('█') && grid1.includes('SCORE'));
const head1 = await page.evaluate(() => window.__sh = null || (() => { return null; })()); // noop
// steer up, verify grid changes over ticks
await page.keyboard.press('ArrowUp');
await sleep(500);
const grid2 = await page.evaluate(() => {
  const pres = document.querySelectorAll('#out pre');
  return pres.length ? pres[pres.length - 1].textContent : '';
});
// head row index of █
function headRow(g) { return g.split('\n').findIndex(l => l.includes('█')); }
check('snake responds to ArrowUp (head moved up)', headRow(grid2) !== -1 && headRow(grid2) < headRow(grid1), `row ${headRow(grid1)} -> ${headRow(grid2)}`);
await page.screenshot({ path: `${outDir}/${prefix}-snake.png` });
await page.keyboard.press('q'); await sleep(300);
t = await outText();
check('snake quits with q', t.includes('the snake understands'));

// 10. reduced motion probe (fresh page)
const rm = await browser.newPage();
await rm.setViewport({ width: 1440, height: 900 });
wire(rm);
await rm.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const rt0 = Date.now();
await rm.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
try {
  await rm.waitForFunction(() => document.getElementById('out').innerText.includes('FABLE-DOS SHELL'), { timeout: 8000 });
  check('reduced-motion boot is near-instant', (Date.now() - rt0) < 3000, `${Date.now() - rt0}ms`);
} catch (e) { check('reduced-motion boot', false, 'timed out'); }
await rm.close();

// ---------- MOBILE ----------
const mob = await browser.newPage();
await mob.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
wire(mob);
await mob.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
try {
  await mob.waitForFunction(() => document.getElementById('out').innerText.includes('FABLE-DOS SHELL'), { timeout: 15000 });
} catch (e) { check('mobile boot', false, 'timed out'); }
await sleep(500);
const chipsVisible = await mob.evaluate(() => {
  const p = document.getElementById('palette');
  const cs = getComputedStyle(p);
  return cs.display !== 'none' && p.querySelectorAll('.chip').length;
});
check('mobile command chips visible', !!chipsVisible, `${chipsVisible} chips`);
await mob.screenshot({ path: `${outDir}/${prefix}-mobile.png` });
// tap a chip
const tapped = await mob.evaluate(() => {
  const chips = [...document.querySelectorAll('.chip')];
  const c = chips.find(x => x.textContent === 'cat readme.txt');
  if (!c) return false;
  c.click(); return true;
});
await sleep(1800);
const mt = await mob.evaluate(() => document.getElementById('out').innerText);
check('chip tap runs cat readme.txt', tapped && mt.includes('WELCOME, GUEST'));
await mob.screenshot({ path: `${outDir}/${prefix}-mobile-chip.png` });
await mob.close();

await browser.close();
console.log(results.join('\n'));
console.log(errors.length ? `CONSOLE_ERRORS (${errors.length}):\n` + [...new Set(errors)].slice(0, 10).map(e => ' - ' + e).join('\n') : 'NO_CONSOLE_ERRORS');
