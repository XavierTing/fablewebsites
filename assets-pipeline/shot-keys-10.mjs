#!/usr/bin/env node
// Variant of shot.mjs for site 10-synth: dispatches keydowns (holds keys) before shooting,
// so the glass keys' active state + ripples/motes + audio-reactive scope are captured.
// Usage: node shot-keys-10.mjs <url-or-file> <out.png> [width] [height] [waitMs] [keys=a,d,g]
import puppeteer from 'puppeteer';

const [target, out, w = '1440', h = '900', waitMs = '3500', keys = 'a,d,g'] = process.argv.slice(2);
if (!out) { console.error('usage: shot-keys-10.mjs <url|file> <out.png> [w] [h] [waitMs] [keys]'); process.exit(1); }
const url = target.startsWith('http') ? target : 'file://' + target;

const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-webgl', '--use-gl=angle', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 300)); });
page.on('pageerror', e => errors.push('PAGEERROR: ' + String(e).slice(0, 300)));
try {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
} catch (e) { errors.push('NAV: ' + e.message.slice(0, 200)); }
await new Promise(r => setTimeout(r, +waitMs));
// hold the requested keys (KeyboardEvent keydown via CDP) and shoot mid-hold
for (const k of keys.split(',')) await page.keyboard.down(k.trim());
await new Promise(r => setTimeout(r, 450)); // let ripples/motes/scope respond
await page.screenshot({ path: out });
for (const k of keys.split(',')) await page.keyboard.up(k.trim());
await browser.close();
console.log('SHOT', out);
if (errors.length) { console.log('CONSOLE_ERRORS (' + errors.length + '):'); [...new Set(errors)].slice(0, 10).forEach(e => console.log(' -', e)); }
else console.log('NO_CONSOLE_ERRORS');
