/*
 * Search-engine details for every page: titles, descriptions and structured data (JSON-LD).
 * Used when the pages are pre-rendered at build time and when moving between pages in the browser.
 */
import { pillars, site, social } from './data/content.js';

export const ORIGIN = 'https://bhumaji.com';

const HOME = {
  title: 'Bhumaji Systems | Cloud, AI, Software & App Development Company in Bengaluru',
  description:
    'Bhumaji Systems is a Bengaluru technology company for cloud services and migration, AI/ML and MLOps, custom software development, and mobile app and website development, serving businesses in India and worldwide.',
};

/** Every page of the site, in sitemap order. */
export const routes = ['/', ...pillars.map((p) => p.path)];

export const pillarForPath = (path) => pillars.find((p) => p.path === path);

export function pageMeta(path) {
  const p = pillarForPath(path);
  const base = p ? { title: `${p.seoTitle} | Bhumaji Systems`, description: p.seoDescription } : HOME;
  return { ...base, url: ORIGIN + (p ? p.path : '/'), image: `${ORIGIN}/og-image.png` };
}

const ORG_ID = `${ORIGIN}/#organization`;

function organization() {
  return {
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: site.name,
    url: `${ORIGIN}/`,
    logo: `${ORIGIN}/logo.png`,
    image: `${ORIGIN}/og-image.png`,
    slogan: site.tagline,
    description: HOME.description,
    email: site.contactEmail,
    ...(site.phone ? { telephone: site.phone } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
    areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
    sameAs: social.filter((s) => s.url).map((s) => s.url),
    knowsAbout: [
      'Cloud services', 'Cloud migration', 'AWS', 'Microsoft Azure', 'Google Cloud', 'Kubernetes', 'DevOps',
      'Artificial intelligence', 'Machine learning', 'MLOps', 'Generative AI',
      'Custom software development', 'Mobile app development', 'Website development', 'UI/UX design',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Technology services',
      itemListElement: pillars.map((p) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: p.title, url: ORIGIN + p.path },
      })),
    },
  };
}

export function jsonLd(path) {
  const p = pillarForPath(path);
  const graph = [organization()];
  if (!p) {
    graph.push({ '@type': 'WebSite', '@id': `${ORIGIN}/#website`, url: `${ORIGIN}/`, name: site.name, publisher: { '@id': ORG_ID } });
  } else {
    graph.push(
      {
        '@type': 'Service',
        name: p.title,
        serviceType: p.title,
        description: p.seoDescription,
        url: ORIGIN + p.path,
        provider: { '@id': ORG_ID },
        areaServed: [{ '@type': 'Country', name: 'India' }, 'Worldwide'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: p.title,
          itemListElement: p.items.map((name) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}/` },
          { '@type': 'ListItem', position: 2, name: 'Services', item: `${ORIGIN}/#what-we-do` },
          { '@type': 'ListItem', position: 3, name: p.title, item: ORIGIN + p.path },
        ],
      }
    );
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** The <head> tags for one page, as an HTML string. */
export function headTags(path, { noindex = false } = {}) {
  const m = pageMeta(path);
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${m.url}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.name)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.description)}" />`,
    `<meta property="og:url" content="${m.url}" />`,
    `<meta property="og:image" content="${m.image}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(m.title)}" />`,
    `<meta name="twitter:description" content="${esc(m.description)}" />`,
    `<meta name="twitter:image" content="${m.image}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd(path)).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}

/** Keep the browser tab title, description and canonical in step when moving between pages. */
export function applyMeta(path) {
  const m = pageMeta(path);
  document.title = m.title;
  const set = (sel, attr, val) => { const el = document.head.querySelector(sel); if (el) el.setAttribute(attr, val); };
  set('meta[name="description"]', 'content', m.description);
  set('link[rel="canonical"]', 'href', m.url);
  set('meta[property="og:url"]', 'content', m.url);
  set('meta[property="og:title"]', 'content', m.title);
  set('meta[property="og:description"]', 'content', m.description);
}
