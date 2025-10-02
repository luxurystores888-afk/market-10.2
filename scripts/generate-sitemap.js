import fs from 'fs';

const products = []; // Fetch from DB or API (for demo; in real, use async fetch)

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://yourdomain.com/</loc></url>
  ${products.map(p => `<url><loc>http://yourdomain.com/product/${p.id}</loc></url>`).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemap);
