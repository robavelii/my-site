import { renderToString } from 'react-dom/server';
import { matchRoute } from './routes';
import { buildBlogPage } from './blog/render';
import { POSTS, postUrl } from './blog/posts';

export { SITE_URL } from './blog/render';
export { POSTS };

/** Every path the prerender step writes. The home page stays client-rendered. */
export const prerenderPaths = () => ['/blog', ...POSTS.map((post) => postUrl(post.slug))];

export async function render(path: string) {
  const page = await buildBlogPage(matchRoute(path));
  return { html: renderToString(page.element), head: page.head, status: page.status };
}
