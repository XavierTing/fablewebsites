#!/usr/bin/env node
// Headless screenshot + console-error capture for iteration passes.
// Usage: node shot.mjs <url-or-file> <out.png> [width] [height] [waitMs]
import puppeteer from 'puppeteer';

const [target, out, w = '1440', h = '900', waitMs = '3500'] = process.argv.slice(2);
if (!out) { console.error('usage: shot.mjs <url|file> <out.png> [w] [h] [waitMs]'); process.exit(1); }
const url = target.startsWith('http') ? target : 'file://' + target;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-webgl', '--use-gl=angle'] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));
try {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
} catch (e) { errors.push('NAV: ' + e.message.slice(0, 200)); }
await new Promise(r => setTimeout(r, +waitMs));
await page.screenshot({ path: out });
await browser.close();
console.log('SHOT', out);
if (errors.length) { console.log('CONSOLE_ERRORS (' + errors.length + '):'); [...new Set(errors)].slice(0, 10).forEach(e => console.log(' -', e)); }
else console.log('NO_CONSOLE_ERRORS');
