#!/usr/bin/env node
// Batch image generation from manifest-arcana.json with concurrency 3.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const ROOT = '/Users/xavierting/Desktop/Xavier Agentic Workflow/Website Inspiration/assets-pipeline';
const OUT_ROOT = join(ROOT, 'generated');
const envFile = readFileSync('/Users/xavierting/Desktop/Xavier Agentic Workflow/Thumbnail Generator/.env', 'utf8');
const KEY = envFile.match(/^OPENAI_API_KEY=(.+)$/m)[1].trim();
const manifest = JSON.parse(readFileSync(join(ROOT, 'manifest-arcana.json'), 'utf8'));

async function genOne(item, attempt = 1) {
  const outPath = join(OUT_ROOT, item.out);
  if (existsSync(outPath)) { console.log('SKIP (exists)', item.out); return; }
  mkdirSync(dirname(outPath), { recursive: true });
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-image-2', prompt: item.prompt, size: item.size, quality: item.quality, n: 1 }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(res.status + ' ' + JSON.stringify(data).slice(0, 300));
    writeFileSync(outPath, Buffer.from(data.data[0].b64_json, 'base64'));
    console.log('OK', item.out);
  } catch (e) {
    console.error('FAIL', item.out, String(e).slice(0, 200));
    if (attempt < 3) { await new Promise(r => setTimeout(r, 15000 * attempt)); return genOne(item, attempt + 1); }
    console.error('GIVEUP', item.out);
  }
}

const queue = [...manifest];
const workers = Array.from({ length: 3 }, async () => {
  while (queue.length) { const item = queue.shift(); await genOne(item); }
});
await Promise.all(workers);
console.log('BATCH DONE');
