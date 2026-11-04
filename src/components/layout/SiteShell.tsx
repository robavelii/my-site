import React, { useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Header, type HeaderPage } from './Header';
import { CommandPalette } from '../ui/CommandPalette';
import { useKeyboardShortcut } from '../../hooks/useKeyboardShortcut';
import { CONTACT_EMAIL, SOCIAL } from '../../data/constants';

interface SiteShellProps {
  page: HeaderPage;
  /** Drawn behind everything, outside the stacking context of the content. */
  backdrop?: React.ReactNode;
  mainClassName: string;
  children: React.ReactNode;
}

/** The chrome every page shares: skip link, header, footer, command palette. */
export const SiteShell: React.FC<SiteShellProps> = ({
  page,
  backdrop,
  mainClassName,
  children,
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  // Cmd/Ctrl+K opens the palette. Previously this was gated behind an
  // `isDesktop` check that treated any touch capability as "no keyboard", so it
  // silently did nothing on touchscreen laptops or any window under 1024px.
  useKeyboardShortcut({
    key: 'k',
    modifier: true,
    callback: () => setPaletteOpen((open) => !open),
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 transition-colors duration-300 selection:bg-zinc-900 selection:text-zinc-50 dark:selection:bg-zinc-100 dark:selection:text-zinc-900 font-sans relative">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-zinc-900 focus:text-zinc-50 dark:focus:bg-zinc-100 dark:focus:text-zinc-900 focus:rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        Skip to main content
      </a>

      {backdrop}

      <div className="relative z-10">
        <Header page={page} onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main-content" className={mainClassName}>
          {children}
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 mt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
              <p>&copy; {new Date().getFullYear()} Robel Fekadu</p>
              <div className="flex items-center gap-6">
                <a
                  href="/blog/rss.xml"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  RSS
                </a>
                <a
                  href={SOCIAL.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href={SOCIAL.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  Email
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>

      {paletteOpen && <CommandPalette page={page} onClose={() => setPaletteOpen(false)} />}

      <SpeedInsights />
      <Analytics />
    </div>
  );
};
