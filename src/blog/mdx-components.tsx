import React from 'react';
import type { MDXComponents } from 'mdx/types';

type PreProps = React.ComponentProps<'pre'> & {
  'data-title'?: string;
  'data-language'?: string;
};

/** A highlighted block, captioned with its real filename when the fence names one. */
const CodeBlock: React.FC<PreProps> = ({ 'data-title': title, ...props }) => (
  <figure className="blog-code">
    {title && <figcaption>{title}</figcaption>}
    <pre {...props} />
  </figure>
);

export const mdxComponents: MDXComponents = {
  pre: CodeBlock,
};
