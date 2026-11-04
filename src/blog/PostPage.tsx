import React, { useMemo } from 'react';
import { ExternalLink } from 'lucide-react';
import { Github } from '../components/ui/BrandIcons';
import { PROJECTS } from '../data/constants';
import { POSTS, postUrl, type PostMeta, type PostModule } from './posts';
import { formatDate } from './format';
import { mdxComponents } from './mdx-components';
import { ContentsRail } from './ContentsRail';

interface PostPageProps {
  post: PostMeta;
  module: PostModule;
}

export const PostPage: React.FC<PostPageProps> = ({ post, module }) => {
  const Content = module.default;
  const sections = useMemo(
    () =>
      module.toc
        .flatMap((entry) => (entry.depth === 2 ? [entry] : (entry.children ?? [])))
        .filter((entry) => entry.depth === 2 && entry.id),
    [module]
  );
  const project = PROJECTS.find((p) => p.id === post.project);
  const index = POSTS.findIndex((p) => p.slug === post.slug);
  const newer = index > 0 ? POSTS[index - 1] : undefined;
  const older = index >= 0 ? POSTS[index + 1] : undefined;

  return (
    <article className="post">
      <header className="post-head">
        <h1>{post.title}</h1>
        <p className="post-dek">{post.summary}</p>
        <dl className="post-meta">
          <div>
            <dt>Published</dt>
            <dd>
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </dd>
          </div>
          <div>
            <dt>Reading time</dt>
            <dd>{post.readingMinutes} minutes</dd>
          </div>
          {project && (
            <div>
              <dt>Project</dt>
              <dd>
                <a href="#about-the-project">{project.name}</a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="post-grid">
        {sections.length > 0 && <ContentsRail sections={sections} />}
        <div className="post-body">
          <Content components={mdxComponents} />
        </div>
      </div>

      <footer className="post-end">
        {project && (
          <section className="post-project" aria-labelledby="about-the-project">
            <h2 id="about-the-project">About {project.name}</h2>
            <p>{project.description}</p>
            <ul className="post-project-links">
              {project.links?.repo && (
                <li>
                  <a href={project.links.repo}>
                    <Github className="icon" aria-hidden="true" />
                    Read the source
                  </a>
                </li>
              )}
              {project.links?.demo && (
                <li>
                  <a href={project.links.demo}>
                    <ExternalLink className="icon" aria-hidden="true" />
                    Try {project.name}
                  </a>
                </li>
              )}
              <li>
                <a href="/#projects">See it among my other projects</a>
              </li>
            </ul>
          </section>
        )}

        <nav className="post-pager" aria-label="More posts">
          {older && (
            <a href={postUrl(older.slug)} rel="prev">
              <span className="post-pager-label">Older</span>
              {older.title}
            </a>
          )}
          {newer && (
            <a href={postUrl(newer.slug)} rel="next">
              <span className="post-pager-label">Newer</span>
              {newer.title}
            </a>
          )}
          <a href="/blog">
            <span className="post-pager-label">All posts</span>
            Build notes
          </a>
          <a href="/blog/rss.xml">
            <span className="post-pager-label">Follow along</span>
            RSS feed
          </a>
        </nav>
      </footer>
    </article>
  );
};
