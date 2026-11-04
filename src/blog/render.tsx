import React from 'react';
import { ThemeProvider } from '../context/ThemeContext';
import { SiteShell } from '../components/layout/SiteShell';
import type { Route } from '../routes';
import { BlogIndexPage } from './BlogIndexPage';
import { PostPage } from './PostPage';
import { findPost, loadPost, postUrl } from './posts';

export const SITE_URL = 'https://robelfekadu.com';

/** What a prerendered page puts in its <head>. */
export interface PageHead {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  ogImage: string;
  publishedTime?: string;
}

export interface BlogPage {
  element: React.ReactElement;
  head: PageHead;
  status: 200 | 404;
}

const shell = (children: React.ReactNode) => (
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <SiteShell page="blog" mainClassName="blog-main">
      {children}
    </SiteShell>
  </ThemeProvider>
);

const NotFound: React.FC = () => (
  <div className="blog-index">
    <h1>No post at this address</h1>
    <p>
      It may have moved. <a href="/blog">Every post is listed on the blog</a>.
    </p>
  </div>
);

/** Resolves a /blog route to its tree and head, loading the post's module first. */
export async function buildBlogPage(route: Route): Promise<BlogPage> {
  if (route.kind === 'blog') {
    return {
      element: shell(<BlogIndexPage />),
      status: 200,
      head: {
        title: 'Build notes | Robel Fekadu',
        description:
          'Build notes by Robel Fekadu: what he built, how it works, what broke, what he’d keep.',
        path: '/blog',
        type: 'website',
        ogImage: '/blog/og/index.png',
      },
    };
  }

  const post = route.kind === 'post' ? findPost(route.slug) : undefined;
  const module = post && (await loadPost(post.slug));
  if (!post || !module) {
    return {
      element: shell(<NotFound />),
      status: 404,
      head: {
        title: 'Not found | Robel Fekadu',
        description: 'There is no post at this address.',
        path: '/blog',
        type: 'website',
        ogImage: '/blog/og/index.png',
      },
    };
  }

  return {
    element: shell(<PostPage post={post} module={module} />),
    status: 200,
    head: {
      title: `${post.title} | Robel Fekadu`,
      description: post.summary,
      path: postUrl(post.slug),
      type: 'article',
      ogImage: `/blog/og/${post.slug}.png`,
      publishedTime: post.date,
    },
  };
}
