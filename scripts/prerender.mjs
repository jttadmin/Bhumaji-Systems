/*
 * Runs after `vite build`: renders every page to full HTML so search engines see the real
 * content, writes per-page titles, descriptions and structured data, and creates
 * sitemap.xml and robots.txt. Output goes into dist/ alongside the client build.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const ssrDir = join(root, 'dist-ssr');
const ORIGIN = 'https://www.bhumaji.com'; // keep in step with src/seo.js and public/CNAME

const { render, routes, headTags } = await import(pathToFileURL(join(ssrDir, 'entry-server.js')).href);
const template = readFileSync(join(dist, 'index.html'), 'utf8');
if (!template.includes('<!--app-head-->') || !template.includes('<div id="root"></div>')) {
  throw new Error('index.html is missing the <!--app-head--> marker or the empty #root element');
}

const page = (path, opts) =>
  template
    .replace('<!--app-head-->', headTags(path, opts))
    .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);

for (const path of routes) {
  const file = join(dist, path, 'index.html');
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page(path));
  console.log(`prerendered ${path}`);
}

// Unknown URLs: GitHub Pages serves 404.html. Show the homepage content, but keep it out of search results.
writeFileSync(join(dist, '404.html'), page('/', { noindex: true }));

const today = new Date().toISOString().slice(0, 10);
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map((p) => `  <url><loc>${ORIGIN}${p}</loc><lastmod>${today}</lastmod><priority>${p === '/' ? '1.0' : '0.8'}</priority></url>`)
  .join('\n')}
</urlset>
`
);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${ORIGIN}/sitemap.xml\n`);

rmSync(ssrDir, { recursive: true, force: true });
console.log(`wrote 404.html, sitemap.xml (${routes.length} pages) and robots.txt`);
