# Bhumaji Systems — website

Cloud. Intelligence. Engineering.

A React + Vite site for Bhumaji Systems. This first release is the fully polished homepage plus a detail page for each of the four service pillars.

## Run it

```bash
npm install
npm run dev      # local development at http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the production build locally
```

Node 18 or newer is required.

## Where things live

```
index.html                  SEO meta, Open Graph, JSON-LD, Google Fonts
public/favicon.svg          Placeholder mark (swap for the official logo)
src/data/content.js         ALL website copy: services, industries, process, engagements
src/styles/global.css       Design tokens (top of file) and all component styles
src/components/
  Header.jsx                Desktop mega-menus + full-screen mobile navigation
  Hero.jsx, HeroCanvas.jsx  Hero copy and the animated cloud "planet" (Canvas 2D)
  Pillars.jsx, Motifs.jsx   Four expanding service panels, each with its own illustration
  Ecosystem.jsx             Orbiting technology ecosystem (layered list on mobile)
  Industries.jsx            Tabbed industry stories
  Process.jsx               Discover → Optimize as a CI-style pipeline
  Projects.jsx              Engagements carousel (typical work we deliver)
  Why.jsx                   "Why Bhumaji" spec sheet
  Insights.jsx              Upcoming articles
  Contact.jsx               Enquiry form with service selection
  Footer.jsx
src/pages/
  Home.jsx                  Homepage section order
  ServicePage.jsx           Service detail template (#service-cloud, #service-ai, …)
```

## Before launch

1. **Real case studies and testimonials.** The "Engagements" section describes typical work without client names or results. Add real case studies and testimonials in `src/data/content.js` once clients approve them.
2. **Add contact details** in `site` inside `src/data/content.js` (`contactEmail`, `phone`).
3. **Enquiry form email.** Get a free access key for contactus@bhumaji.com at https://web3forms.com and add it as the repository variable `WEB3FORMS_KEY` (Settings → Secrets and variables → Actions → Variables). Without a key the form uses FormSubmit; if sending fails, visitors get a pre-filled email instead.
4. **Logo.** The official artwork lives in `src/assets/` (`bhumaji-logo.png` lockup, `bhumaji-mark.png` icon) with favicons in `public/`. Replace those files to update it everywhere.
5. **Add an Open Graph image** (`public/og.png`, 1200×630) and reference it in `index.html`.

## Routing

The site uses lightweight hash routing (`src/App.jsx`): `#service-cloud`, `#service-ai`, `#service-software` and `#service-mobile` open service pages; any other hash scrolls to a homepage section. When you add more pages (Insights articles, About), move to `react-router` with real paths for better SEO.

## Deploying on GitHub Pages

1. Push this folder to a GitHub repository (branch `main`). `package-lock.json` is included, which the workflow needs.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Every push to `main` now builds the site and publishes `dist/` (see `.github/workflows/deploy.yml`).

**Custom domain (bhumaji.com):** in **Settings → Pages → Custom domain**, enter `bhumaji.com` and tick **Enforce HTTPS**. At your DNS provider, add A records for `bhumaji.com` pointing to 185.199.108.153, 185.199.109.153, 185.199.110.153 and 185.199.111.153, plus a CNAME record for `www` pointing to `<your-username>.github.io`.

**No custom domain, project URL (`<user>.github.io/<repo>/`):** add a repository variable `BASE_PATH` set to `/<repo>/` (Settings → Secrets and variables → Actions → Variables) so asset paths resolve.

## Deploying elsewhere

The `dist/` folder is a static site. It deploys as-is to S3 + CloudFront, Netlify, Vercel, Cloudflare Pages or any static host. Point the bhumaji.com DNS record at the host once the build is live.
