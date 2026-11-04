// Runs after both Vite builds (see "build" in package.json). Writes:
//   dist/blog.html, dist/blog/<slug>.html   prerendered pages (cleanUrls serves them)
//   dist/blog/og/*.png                      1200x630 share cards
//   dist/blog/rss.xml, dist/sitemap.xml     feeds
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const server = await import(resolve(root, 'dist-ssr/entry-server.js'));
const { SITE_URL, POSTS } = server;

const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const write = async (file, data) => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
};

// --- pages -----------------------------------------------------------------

/** Swaps the home page's head for the route's own, leaving everything else as built. */
function withHead(template, head) {
  const url = `${SITE_URL}${head.path}`;
  const image = `${SITE_URL}${head.ogImage}`;
  const title = escapeHtml(head.title);
  const description = escapeHtml(head.description);
  const set = (html, pattern, replacement) => {
    if (!pattern.test(html)) throw new Error(`prerender: index.html no longer matches ${pattern}`);
    return html.replace(pattern, replacement);
  };

  let html = template;
  html = set(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`);
  html = set(
    html,
    /<meta name="title" content="[^"]*" \/>/,
    `<meta name="title" content="${title}" />`
  );
  html = set(
    html,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${description}" />`
  );
  html = set(
    html,
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${url}" />`
  );
  html = set(
    html,
    /<meta property="og:type" content="[^"]*" \/>/,
    `<meta property="og:type" content="${head.type}" />`
  );
  html = html.replace(/(<meta property="(?:og|twitter):url" content=")[^"]*(" \/>)/g, `$1${url}$2`);
  html = html.replace(
    /(<meta\s+property="(?:og|twitter):title"\s+content=")[^"]*("\s*\/>)/g,
    `$1${title}$2`
  );
  html = html.replace(
    /(<meta\s+property="(?:og|twitter):description"\s+content=")[^"]*("\s*\/>)/g,
    `$1${description}$2`
  );
  html = html.replace(
    /(<meta property="(?:og|twitter):image" content=")[^"]*(" \/>)/g,
    `$1${image}$2`
  );
  html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(" \/>)/, `$1${title}$2`);

  const extra = [
    cssLinks,
    `<link rel="alternate" type="application/rss+xml" title="Robel Fekadu: build notes" href="${SITE_URL}/blog/rss.xml" />`,
    head.publishedTime &&
      `<meta property="article:published_time" content="${head.publishedTime}" />`,
  ]
    .filter(Boolean)
    .join('\n    ');
  return html.replace('</head>', `    ${extra}\n  </head>`);
}

// The blog's stylesheet ships as a chunk of the lazily loaded blog client. Link
// it from the head so a prerendered page is styled before any script runs.
const manifest = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'));
const blogCss = manifest['src/blog/client.tsx']?.css ?? [];
if (!blogCss.length) throw new Error('prerender: no CSS found for src/blog/client.tsx');
const cssLinks = blogCss.map((file) => `<link rel="stylesheet" href="/${file}" />`).join('\n    ');

const template = await readFile(resolve(dist, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>'))
  throw new Error('prerender: no empty #root in index.html');

for (const path of server.prerenderPaths()) {
  const { html, head, status } = await server.render(path);
  if (status !== 200) throw new Error(`prerender: ${path} rendered ${status}`);
  const page = withHead(template, head).replace(
    '<div id="root"></div>',
    `<div id="root">${html}</div>`
  );
  await write(resolve(dist, `.${path}.html`), page);
  console.log(`prerendered ${path}`);
}

// --- share cards -----------------------------------------------------------

const font = (pkg, file) => readFile(resolve(root, 'node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Inter', weight: 400, data: await font('inter', 'inter-latin-400-normal.woff') },
  { name: 'Inter', weight: 600, data: await font('inter', 'inter-latin-600-normal.woff') },
  {
    name: 'JetBrains Mono',
    weight: 400,
    data: await font('jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff'),
  },
];

const h = (type, style, ...children) => ({ type, props: { style, children } });

async function card({ title, summary, footer }) {
  const svg = await satori(
    h(
      'div',
      {
        // Satori sizes boxes content-box, so the padding is subtracted here
        // rather than added on top: 1200 x 630 overall.
        width: 1040,
        height: 486,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '72px 80px',
        background: '#09090b',
        backgroundImage:
          'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        color: '#fafafa',
        fontFamily: 'Inter',
      },
      h(
        'div',
        { display: 'flex', flexDirection: 'column', gap: 28 },
        h('div', { width: 64, height: 4, background: '#34d399' }),
        h(
          'div',
          {
            fontSize: 68,
            fontWeight: 600,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            maxWidth: 980,
          },
          title
        ),
        h('div', { fontSize: 30, lineHeight: 1.4, color: '#a1a1aa', maxWidth: 940 }, summary)
      ),
      h(
        'div',
        {
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: 'JetBrains Mono',
          fontSize: 24,
          color: '#a1a1aa',
        },
        h('div', {}, 'robelfekadu.com/blog'),
        h('div', {}, footer)
      )
    ),
    { width: 1200, height: 630, fonts }
  );
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}

await write(
  resolve(dist, 'blog/og/index.png'),
  await card({
    title: 'Build notes',
    summary: 'What I built, how it works, what broke, what I’d keep.',
    footer: 'Robel Fekadu',
  })
);
for (const post of POSTS) {
  await write(
    resolve(dist, `blog/og/${post.slug}.png`),
    await card({
      title: post.title,
      summary: post.summary,
      footer: `${post.readingMinutes} min read`,
    })
  );
}
console.log(`wrote ${POSTS.length + 1} share cards`);

// --- feeds -----------------------------------------------------------------

const rfc822 = (iso) => new Date(`${iso}T00:00:00Z`).toUTCString();
const items = POSTS.map(
  (post) => `    <item>
      <title>${escapeHtml(post.title)}</title>
      <link>${SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${rfc822(post.date)}</pubDate>
      <description>${escapeHtml(post.summary)}</description>
    </item>`
).join('\n');
await write(
  resolve(dist, 'blog/rss.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Robel Fekadu: build notes</title>
    <link>${SITE_URL}/blog</link>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>What I built, how it works, what broke, what I’d keep.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`
);

const urls = [
  { loc: `${SITE_URL}/`, priority: '1.0' },
  { loc: `${SITE_URL}/blog`, lastmod: POSTS[0]?.date, priority: '0.8' },
  ...POSTS.map((post) => ({
    loc: `${SITE_URL}/blog/${post.slug}`,
    lastmod: post.updated ?? post.date,
    priority: '0.7',
  })),
];
await write(
  resolve(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>${u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ''}
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`
);
console.log('wrote rss.xml and sitemap.xml');
