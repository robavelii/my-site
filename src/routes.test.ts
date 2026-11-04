import { describe, it, expect } from 'vitest';
import { matchRoute } from './routes';

describe('matchRoute', () => {
  it('sends / and /index.html home', () => {
    expect(matchRoute('/')).toEqual({ kind: 'home' });
    expect(matchRoute('/index.html')).toEqual({ kind: 'home' });
  });

  it('matches the blog index with or without a trailing slash', () => {
    expect(matchRoute('/blog')).toEqual({ kind: 'blog' });
    expect(matchRoute('/blog/')).toEqual({ kind: 'blog' });
  });

  it('matches a post by slug', () => {
    expect(matchRoute('/blog/clipsync')).toEqual({ kind: 'post', slug: 'clipsync' });
  });

  it('treats anything else as missing', () => {
    expect(matchRoute('/blog/clipsync/extra')).toEqual({ kind: 'missing' });
    expect(matchRoute('/blog/Not_A_Slug')).toEqual({ kind: 'missing' });
    expect(matchRoute('/about')).toEqual({ kind: 'missing' });
  });
});
