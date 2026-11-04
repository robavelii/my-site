import React from 'react';
import type { PostMeta, PostModule } from './posts';
import { formatDate } from './format';
import { mdxComponents } from './mdx-components';

interface PostPageProps {
  post: PostMeta;
  module: PostModule;
}

export const PostPage: React.FC<PostPageProps> = ({ post, module }) => {
  const Content = module.default;
  const sections = module.toc
    .flatMap((entry) => (entry.depth === 2 ? [entry] : (entry.children ?? [])))
    .filter((entry) => entry.depth === 2 && entry.id);

  return (
    <article className="blog-post">
      <header className="blog-post-header">
        <h1>{post.title}</h1>
        <p>{post.summary}</p>
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span>{post.readingMinutes} min read</span>
      </header>

      {sections.length > 0 && (
        <nav aria-label="In this post" className="blog-post-toc">
          <ol>
            {sections.map((entry) => (
              <li key={entry.id}>
                <a href={`#${entry.id}`}>{entry.value}</a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="blog-post-body">
        <Content components={mdxComponents} />
      </div>
    </article>
  );
};
