// Adds Subresource Integrity (SRI) and crossorigin to external scripts/styles in public/index.html
// Run: node scripts/add-sri.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const file = path.join(process.cwd(), 'public', 'index.html');
let html = fs.readFileSync(file, 'utf8');

async function fetchAndHash(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      const chunks = [];
      res.on('data', (d) => chunks.push(d));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        const hash = crypto.createHash('sha384').update(buf).digest('base64');
        resolve(`sha384-${hash}`);
      });
    }).on('error', reject);
  });
}

async function process() {
  const matches = [...html.matchAll(/<(script|link)([^>]+)(src|href)="(https:[^"]+)"([^>]*)>/gi)];
  for (const m of matches) {
    const full = m[0];
    const tag = m[1].toLowerCase();
    const url = m[4];
    if (!url.startsWith('https://')) continue;
    try {
      const integrity = await fetchAndHash(url);
      let replaced = full;
      if (!/integrity=/.test(replaced)) replaced = replaced.replace(/>$/, ` integrity="${integrity}" crossorigin="anonymous">`);
      html = html.replace(full, replaced);
      console.log('SRI added:', url);
    } catch (e) {
      console.warn('SRI failed:', url);
    }
  }
  fs.writeFileSync(file, html, 'utf8');
}

process();

