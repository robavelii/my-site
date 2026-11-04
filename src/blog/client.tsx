import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import type { Route } from '../routes';
import { buildBlogPage } from './render';

/**
 * Production serves /blog pages prerendered, so React hydrates the markup that
 * is already there. The dev server has no prerender step and hands back an
 * empty root, so there it renders from scratch.
 */
export async function mountBlog(container: HTMLElement, route: Route) {
  const { element } = await buildBlogPage(route);
  const tree = <React.StrictMode>{element}</React.StrictMode>;
  if (container.hasChildNodes()) hydrateRoot(container, tree);
  else createRoot(container).render(tree);
}
