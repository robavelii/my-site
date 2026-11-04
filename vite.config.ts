import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import remarkFrontmatter from 'remark-frontmatter';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import rehypeExtractToc from '@stefanprobst/rehype-extract-toc';
import rehypeExportToc from '@stefanprobst/rehype-extract-toc/mdx';
import { shikiCodeTitle } from './scripts/mdx-plugins.mjs';
import { postsManifest } from './scripts/posts-manifest.mjs';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    postsManifest(),
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkGfm,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              // Both palettes ship as CSS variables on each token; blog.css
              // picks one per theme, so there is no highlighter at runtime.
              themes: { light: 'github-light-high-contrast', dark: 'github-dark' },
              defaultColor: false,
              transformers: [shikiCodeTitle()],
            },
          ],
          rehypeExtractToc,
          [rehypeExportToc, { name: 'toc' }],
        ],
      }),
    },
    react({ include: /\.(mdx|js|jsx|ts|tsx)$/ }),
  ],
  build: {
    // scripts/prerender.mjs reads this to link the blog's CSS from each page.
    manifest: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
