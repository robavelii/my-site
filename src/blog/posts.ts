import type { ComponentType } from 'react';
import type { MDXComponents } from 'mdx/types';
import manifest from 'virtual:posts';

/** What a post declares in its frontmatter, plus what the build adds. */
export interface PostFrontmatter {
  title: string;
  /** One sentence: the dek under the title, the meta description, the RSS summary. */
  summary: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  updated?: string;
  tags: string[];
  /** Id of the entry in PROJECTS this post is about, if any. */
  project?: string;
  /** Drafts render in `npm run dev` and are left out of production builds. */
  draft?: boolean;
  /** Added by the posts manifest (scripts/posts-manifest.mjs). */
  readingMinutes: number;
}

export interface TocEntry {
  value: string;
  depth: number;
  id?: string;
  children?: TocEntry[];
}

export interface PostModule {
  default: ComponentType<{ components?: MDXComponents }>;
  frontmatter: PostFrontmatter;
  toc: TocEntry[];
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

const loaders = import.meta.glob<PostModule>('/content/posts/*.mdx');

const slugOf = (file: string) => file.replace(/^.*\/([^/]+)\.mdx$/, '$1');

/** Every published post, newest first. Drafts are included only in dev. */
export const POSTS: PostMeta[] = manifest
  .filter((post) => !post.draft || import.meta.env.DEV)
  .sort((a, b) => b.date.localeCompare(a.date));

export const findPost = (slug: string) => POSTS.find((post) => post.slug === slug);

export const loadPost = (slug: string): Promise<PostModule> | undefined => {
  const entry = Object.entries(loaders).find(([file]) => slugOf(file) === slug);
  return entry ? entry[1]() : undefined;
};

export const postUrl = (slug: string) => `/blog/${slug}`;
