#!/usr/bin/env node
// Generate images via OpenAI gpt-image-2. Usage:
//   node gen-image.mjs <out.png> <size> <quality> "<prompt>"
// size: 1024x1024 | 1536x1024 | 1024x1536 ; quality: low|medium|high
import { writeFileSync, readFileSync } from 'fs';

const envFile = readFileSync('/Users/xavierting/Desktop/Xavier Agentic Workflow/Thumbnail Generator/.env', 'utf8');
const KEY = envFile.match(/^OPENAI_API_KEY=(.+)$/m)[1].trim();

const [out, size, quality, prompt] = process.argv.slice(2);
if (!prompt) { console.error('usage: gen-image.mjs <out> <size> <quality> "<prompt>"'); process.exit(1); }

const res = await fetch('https://api.openai.com/v1/images/generations', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ model: 'gpt-image-2', prompt, size, quality, n: 1 }),
});
const data = await res.json();
if (!res.ok) { console.error('ERROR', res.status, JSON.stringify(data).slice(0, 500)); process.exit(1); }
const b64 = data.data[0].b64_json;
writeFileSync(out, Buffer.from(b64, 'base64'));
console.log('OK', out, Buffer.from(b64, 'base64').length, 'bytes');
