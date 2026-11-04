import React, { useRef, useState } from 'react';
import type { MDXComponents } from 'mdx/types';

type PreProps = React.ComponentProps<'pre'> & {
  'data-title'?: string;
  'data-language'?: string;
};

/** A highlighted block, captioned with its real filename when the fence names one. */
const CodeBlock: React.FC<PreProps> = ({ 'data-title': title, ...props }) => {
  const pre = useRef<HTMLPreElement>(null);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const code = pre.current?.innerText ?? '';
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <figure className="code">
      <figcaption className="code-bar">
        <span className="code-title">{title ?? props['data-language']}</span>
        <button type="button" className="code-copy" onClick={copy}>
          <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          <span className="visually-hidden"> code{title ? ` from ${title}` : ''}</span>
        </button>
      </figcaption>
      <pre ref={pre} {...props} />
    </figure>
  );
};

/**
 * An aside that sits in the right margin on wide screens and inline, under its
 * sentence, everywhere else. Numbered with a CSS counter, so no state.
 */
export const Sidenote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="sn">
    <span className="sn-ref" aria-hidden="true" />
    <span className="sn-note" role="note">
      {children}
    </span>
  </span>
);

interface FigureProps {
  caption: React.ReactNode;
  /** Runs into the margin column on wide screens. */
  wide?: boolean;
  children: React.ReactNode;
}

/** A figure with its caption below it: the explorables and diagrams. */
export const Figure: React.FC<FigureProps> = ({ caption, wide, children }) => (
  <figure className={wide ? 'fig fig-wide' : 'fig'}>
    <div className="fig-body">{children}</div>
    <figcaption>{caption}</figcaption>
  </figure>
);

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
  Sidenote,
  Figure,
};
