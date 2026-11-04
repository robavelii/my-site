import React from 'react';
import { POSTS, postUrl } from './posts';
import { formatDate } from './format';

export const BlogIndexPage: React.FC = () => (
  <div className="blog-index">
    <header>
      <h1>Build notes</h1>
      <p>Long-form write-ups of things I built, what broke, and what I'd keep.</p>
    </header>

    <ol className="blog-index-list">
      {POSTS.map((post) => (
        <li key={post.slug}>
          <a href={postUrl(post.slug)}>
            <h2>{post.title}</h2>
            <p>{post.summary}</p>
          </a>
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span>{post.readingMinutes} min read</span>
        </li>
      ))}
    </ol>
  </div>
);
