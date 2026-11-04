export type Route =
  { kind: 'home' } | { kind: 'blog' } | { kind: 'post'; slug: string } | { kind: 'missing' };

/** The site has three kinds of page; anything else under /blog is a miss. */
export function matchRoute(pathname: string): Route {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/' || path === '/index.html') return { kind: 'home' };
  if (path === '/blog') return { kind: 'blog' };
  const post = /^\/blog\/([a-z0-9-]+)$/.exec(path);
  if (post) return { kind: 'post', slug: post[1] };
  return { kind: 'missing' };
}
