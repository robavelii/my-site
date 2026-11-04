import React from 'react';
import { PROJECTS } from '../data/constants';
import { POSTS, postUrl } from './posts';
import { formatDate } from './format';

export const BlogIndexPage: React.FC = () => {
  const [latest, ...earlier] = POSTS;
  const project = latest && PROJECTS.find((p) => p.id === latest.project);

  return (
    <div className="index">
      <header className="index-head">
        <h1>Build notes</h1>
        <p className="lead">What I built, how it works, what broke, what I’d keep.</p>
      </header>

      {latest && (
        <article className="index-latest">
          <div className="index-latest-main">
            <h2>
              <a href={postUrl(latest.slug)}>{latest.title}</a>
            </h2>
            <p className="index-summary">{latest.summary}</p>
            <dl className="post-meta">
              <div>
                <dt>Published</dt>
                <dd>
                  <time dateTime={latest.date}>{formatDate(latest.date)}</time>
                </dd>
              </div>
              <div>
                <dt>Reading time</dt>
                <dd>{latest.readingMinutes} minutes</dd>
              </div>
              {project && (
                <div>
                  <dt>Project</dt>
                  <dd>{project.name}</dd>
                </div>
              )}
            </dl>
            <p>
              <a className="index-read" href={postUrl(latest.slug)}>
                Read the post
              </a>
            </p>
          </div>
          {latest.sections.length > 0 && (
            <nav className="index-sections" aria-label={`Sections of ${latest.title}`}>
              <p>What’s in it</p>
              <ol>
                {latest.sections.map((section) => (
                  <li key={section}>{section}</li>
                ))}
              </ol>
            </nav>
          )}
        </article>
      )}

      {earlier.length > 0 && (
        <section className="index-earlier" aria-labelledby="earlier-posts">
          <h2 id="earlier-posts">Earlier</h2>
          <ol>
            {earlier.map((post) => (
              <li key={post.slug}>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <a href={postUrl(post.slug)}>{post.title}</a>
                <span>{post.readingMinutes} min</span>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
};
