# data-model-site

Marketing website for the Data Model workspace. Static HTML + Tailwind CSS 3.4,
built by a small Node script (no framework). The app itself lives in the
`data-model` repository.

## Commands

```sh
npm install
npm run dev     # build, serve http://127.0.0.1:8080 and rebuild on change
npm run build   # production build into dist/
npm run check   # build + verify every internal link and anchor
```

Requires Node 20+.

## Layout

| Path | Purpose |
|---|---|
| `site.config.json` | Site URL, contact email, form endpoint |
| `src/layout.html` | Shared `<head>` (SEO, Open Graph, icons) and page shell |
| `src/partials/` | Header, footer, CTA (`{{> name}}`) |
| `src/pages/*.html` | One file per route; first line is `<!--meta {"title","description"} -->` |
| `src/input.css`, `tailwind.config.js` | Brand tokens and shared components |
| `static/` | Copied as-is: logo, favicons, screenshots, OG image, JS |
| `design/logo-concepts/` | Logo exploration (not deployed) |
| `scripts/` | Build and link checker |

The build also writes `sitemap.xml`, `robots.txt` and `404.html`. `dist/` can be
deployed to any static host (GitHub Pages, Cloudflare Pages, Netlify, Vercel).

## Before launch

- Set `siteUrl` in `site.config.json` to the real domain (canonical URLs, sitemap, OG image).
- Set `formAction` to a form endpoint (e.g. Formspree) to enable design-partner sign-ups. Until then the form shows a "not connected" message and sends nothing.
- Set `contactEmail` if you want a mailto link.
- Have the privacy notice and terms reviewed; both are drafts.

## Content rules

Copy reflects the current product: offline engines and synthetic fixtures only.
Do not claim live connectors, hosted service, production compatibility or a
licence until they exist. Pricing is the early-access experiment, not a quote.
