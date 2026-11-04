import React, { useEffect, useState } from 'react';
import type { TocEntry } from './posts';

interface ContentsProps {
  sections: TocEntry[];
}

const Links: React.FC<ContentsProps & { active?: string }> = ({ sections, active }) => (
  <ol>
    {sections.map((entry) => (
      <li key={entry.id}>
        <a href={`#${entry.id}`} aria-current={active === entry.id ? 'location' : undefined}>
          {entry.value}
        </a>
      </li>
    ))}
  </ol>
);

/**
 * The post's sections. On wide screens a rail that stays beside the text and
 * marks where you are; on narrow ones a disclosure under the header. Both
 * work without JavaScript; the marker is the only part that needs it.
 */
export const ContentsRail: React.FC<ContentsProps> = ({ sections }) => {
  const [active, setActive] = useState<string>();

  // The current section is the last one whose head has passed 30% of the
  // screen; above the first head, none is.
  useEffect(() => {
    const heads = sections
      .map((entry) => (entry.id ? document.getElementById(entry.id) : null))
      .filter((el): el is HTMLElement => !!el);
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      const passed = heads.filter((el) => el.getBoundingClientRect().top <= line);
      setActive(passed.at(-1)?.id);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [sections]);

  return (
    <>
      <nav className="post-rail" aria-label="In this post">
        <p className="post-rail-title">In this post</p>
        <Links sections={sections} active={active} />
      </nav>
      <details className="post-contents">
        <summary>In this post</summary>
        <Links sections={sections} />
      </details>
    </>
  );
};
