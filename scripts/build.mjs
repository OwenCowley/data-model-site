// Static site build: renders src/pages/*.html into dist/ using the shared
// layout and partials, copies static/ assets, writes sitemap.xml and robots.txt.
// Usage: node scripts/build.mjs [--serve] [--port 8080]
import { readFile, writeFile, readdir, mkdir, cp, rm } from 'node:fs/promises';
import { watch, createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'src');
const dist = path.join(root, 'dist');
const args = process.argv.slice(2);
const serve = args.includes('--serve');
const port = Number(args[args.indexOf('--port') + 1]) || 8080;

const NAV = ['product', 'pricing', 'docs', 'partners', 'about'];

function parseMeta(raw, file) {
  const m = raw.match(/^<!--meta\s+([\s\S]*?)-->\s*/);
  if (!m) throw new Error(`${file}: missing <!--meta {...}--> header`);
  return { meta: JSON.parse(m[1]), body: raw.slice(m[0].length) };
}

function outPath(name) {
  if (name === 'index' || name === '404') return `${name}.html`;
  return `${name}/index.html`;
}

function urlPath(name) {
  return name === 'index' ? '/' : `/${name}/`;
}

async function loadConfig() {
  const config = JSON.parse(await readFile(path.join(root, 'site.config.json'), 'utf8'));
  for (const key of ['siteUrl', 'formAction', 'contactEmail', 'githubUrl']) {
    const env = process.env[`SITE_${key.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}`];
    if (env) config[key] = env;
  }
  config.siteUrl = config.siteUrl.replace(/\/$/, '');
  return config;
}

export async function build() {
  const config = await loadConfig();
  const layout = await readFile(path.join(src, 'layout.html'), 'utf8');
  const partials = {};
  for (const f of await readdir(path.join(src, 'partials'))) {
    partials[path.basename(f, '.html')] = await readFile(path.join(src, 'partials', f), 'utf8');
  }

  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(root, 'static'), dist, { recursive: true });

  const pages = (await readdir(path.join(src, 'pages'))).filter((f) => f.endsWith('.html'));
  const sitemap = [];
  for (const file of pages) {
    const name = path.basename(file, '.html');
    const { meta, body } = parseMeta(await readFile(path.join(src, 'pages', file), 'utf8'), file);
    const vars = {
      ...config,
      title: meta.title,
      description: meta.description,
      canonical: `${config.siteUrl}${urlPath(name)}`,
      year: String(new Date().getFullYear()),
      formConfigured: config.formAction ? 'true' : 'false',
      formAction: config.formAction || '#',
    };
    for (const key of NAV) vars[`active_${key}`] = meta.nav === key ? 'is-active' : '';
    let html = layout.replace('{{content}}', body);
    html = html.replace(/{{>\s*(\w+)\s*}}/g, (_, p) => {
      if (!(p in partials)) throw new Error(`${file}: unknown partial ${p}`);
      return partials[p];
    });
    html = html.replace(/{{\s*(\w+)\s*}}/g, (_, k) => {
      if (!(k in vars)) throw new Error(`${file}: unknown variable ${k}`);
      return vars[k];
    });
    const out = path.join(dist, outPath(name));
    await mkdir(path.dirname(out), { recursive: true });
    await writeFile(out, html);
    if (name !== '404' && !meta.noindex) sitemap.push(vars.canonical);
  }

  await writeFile(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap
      .map((u) => `  <url><loc>${u}</loc></url>`)
      .join('\n')}\n</urlset>\n`,
  );
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${config.siteUrl}/sitemap.xml\n`);
  console.log(`Built ${pages.length} pages into dist/`);
}

function tailwind(minify) {
  const bin = path.join(root, 'node_modules', '.bin', 'tailwindcss');
  const a = ['-i', 'src/input.css', '-o', 'dist/styles.css', ...(minify ? ['--minify'] : [])];
  return new Promise((resolve, reject) => {
    const child = spawn(bin, a, { cwd: root, stdio: ['ignore', 'inherit', 'inherit'] });
    child.on('error', reject);
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`tailwindcss exited with ${code}`))));
  });
}

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.xml': 'application/xml', '.txt': 'text/plain',
  '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.ico': 'image/x-icon',
};

function startServer() {
  createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(dist, p);
    if (!file.startsWith(dist)) { res.writeHead(403).end(); return; }
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
    let status = 200;
    if (!existsSync(file)) { file = path.join(dist, '404.html'); status = 404; }
    res.writeHead(status, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  }).listen(port, '127.0.0.1', () => console.log(`Site: http://127.0.0.1:${port}/`));
}

await build();
await tailwind(!serve);
if (serve) {
  startServer();
  let timer;
  for (const dir of [src, path.join(root, 'static')]) {
    watch(dir, { recursive: true }, () => {
      clearTimeout(timer);
      timer = setTimeout(() => build().then(() => tailwind(false)).catch((e) => console.error(e.message)), 100);
    });
  }
}
