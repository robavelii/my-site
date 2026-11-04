// A Vite plugin that serves `virtual:posts`: every post's frontmatter plus its
// reading time, read straight from content/posts/*.mdx without compiling the
// MDX. The command palette and the blog index import this, so the home page
// bundle carries post titles, not post bodies.
import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { parse } from 'yaml';

const ID = 'virtual:posts';
const RESOLVED = `\0${ID}`;
const WORDS_PER_MINUTE = 230;

/** Words a reader reads: prose and code, without imports, exports or JSX tags. */
const countWords = (body) =>
  body
    .replace(/^(import|export) .*$/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .split(/\s+/)
    .filter((word) => /[\p{L}\p{N}]/u.test(word)).length;

export function postsManifest({ dir = 'content/posts' } = {}) {
  let root = process.cwd();
  return {
    name: 'posts-manifest',
    configResolved(config) {
      root = config.root;
    },
    resolveId(id) {
      return id === ID ? RESOLVED : undefined;
    },
    async load(id) {
      if (id !== RESOLVED) return undefined;
      const folder = resolve(root, dir);
      const files = (await readdir(folder)).filter((file) => file.endsWith('.mdx'));
      const posts = [];
      for (const file of files) {
        const path = resolve(folder, file);
        this.addWatchFile(path);
        const source = await readFile(path, 'utf8');
        const match = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/.exec(source);
        if (!match) throw new Error(`${file}: missing frontmatter`);
        const fm = parse(match[1]);
        for (const key of ['title', 'summary', 'date']) {
          if (!fm[key]) throw new Error(`${file}: frontmatter needs ${key}`);
        }
        posts.push({
          ...fm,
          date: String(fm.date instanceof Date ? fm.date.toISOString().slice(0, 10) : fm.date),
          tags: fm.tags ?? [],
          slug: file.replace(/\.mdx$/, ''),
          readingMinutes: Math.max(1, Math.round(countWords(match[2]) / WORDS_PER_MINUTE)),
        });
      }
      return `export default ${JSON.stringify(posts)};`;
    },
    handleHotUpdate({ file, server }) {
      if (!file.endsWith('.mdx')) return;
      const mod = server.moduleGraph.getModuleById(RESOLVED);
      if (mod) server.moduleGraph.invalidateModule(mod);
    },
  };
}
