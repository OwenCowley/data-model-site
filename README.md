# Moderial website

Marketing website for Moderial (moderial.ai). Static HTML + Tailwind CSS 3.4,
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

## Deploy (Cloudflare Pages)

1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git, pick this repo.
2. Framework preset: None. Build command: `npm run build`. Build output directory: `dist`.
   Node version comes from `.node-version`.
3. Production branch: `main`. Other branches get preview URLs.
4. Custom domains → add `moderial.ai` (and `www.moderial.ai`). With the domain's DNS on
   Cloudflare the records are created automatically.

`static/_headers` sets security and cache headers; Pages serves `404.html` for unknown paths.

## Before launch

- `siteUrl` in `site.config.json` is set to `https://moderial.ai` (canonical URLs, sitemap, OG image). Register the domain before launch.
- Set `formAction` to a form endpoint (e.g. Formspree) to enable design-partner sign-ups. Until then the form shows a "not connected" message and sends nothing.
- Set `contactEmail` if you want a mailto link.
- Have the privacy notice and terms reviewed; both are drafts.

## Content rules

Copy reflects the current product: offline engines and synthetic fixtures only.
Do not claim live connectors, hosted service, production compatibility or a
licence until they exist. Pricing is the early-access experiment, not a quote.
