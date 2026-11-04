declare module 'virtual:posts' {
  import type { PostMeta } from './posts';
  const posts: PostMeta[];
  export default posts;
}
