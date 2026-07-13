#!/usr/bin/env node
// Image-to-video via fal.ai Kling. Usage: node gen-video.mjs <in.(png|jpg)> <out.mp4> "<motion prompt>"
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

const envFile = readFileSync('/Users/xavierting/Desktop/Xavier Agentic Workflow/Thumbnail Generator/.env', 'utf8');
const FAL = envFile.match(/^FAL_KEY=(.+)$/m)[1].trim();
const [inPath, out, prompt] = process.argv.slice(2);
const MODEL = 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video';

// compress to jpeg <1.5MB for data-uri
const jpg = '/tmp/fal-in-' + Math.floor(process.hrtime()[0]) + '.jpg';
execSync(`sips -s format jpeg -s formatOptions 80 "${inPath}" --out "${jpg}"`, { stdio: 'ignore' });
const dataUri = 'data:image/jpeg;base64,' + readFileSync(jpg).toString('base64');
console.log('image payload', Math.round(dataUri.length / 1024), 'KB');

const sub = await fetch(`https://queue.fal.run/${MODEL}`, {
  method: 'POST',
  headers: { 'Authorization': `Key ${FAL}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, image_url: dataUri, duration: '5', cfg_scale: 0.5 }),
});
const subData = await sub.json();
if (!sub.ok) { console.error('SUBMIT FAIL', sub.status, JSON.stringify(subData).slice(0, 400)); process.exit(1); }
console.log('queued', subData.request_id);

const statusUrl = subData.status_url, responseUrl = subData.response_url;
let tries = 0;
while (tries++ < 120) {
  await new Promise(r => setTimeout(r, 10000));
  const st = await (await fetch(statusUrl, { headers: { 'Authorization': `Key ${FAL}` } })).json();
  if (st.status === 'COMPLETED') break;
  if (st.status === 'FAILED' || st.error) { console.error('GEN FAILED', JSON.stringify(st).slice(0, 400)); process.exit(1); }
  if (tries % 6 === 0) console.log('...', st.status, tries * 10 + 's');
}
const result = await (await fetch(responseUrl, { headers: { 'Authorization': `Key ${FAL}` } })).json();
const url = result.video?.url;
if (!url) { console.error('NO VIDEO', JSON.stringify(result).slice(0, 400)); process.exit(1); }
const buf = Buffer.from(await (await fetch(url)).arrayBuffer());
writeFileSync(out, buf);
console.log('OK', out, Math.round(buf.length / 1024), 'KB');
