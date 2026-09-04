import React, { useState } from 'react';
import { ThemeProvider } from './src/context/ThemeContext';
import { Header } from './src/components/layout/Header';
import { Hero } from './src/components/sections/Hero';
import { Services } from './src/components/sections/Services';
import { Projects } from './src/components/sections/Projects';
import { TechStack } from './src/components/sections/TechStack';
import { Contact } from './src/components/sections/Contact';
import { useKeyboardShortcut } from './src/hooks/useKeyboardShortcut';
import { CommandPalette } from './src/components/ui/CommandPalette';
import { ParticleNetwork } from './src/components/ui/ParticleNetwork';
import { CONTACT_EMAIL, SOCIAL } from './src/data/constants';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const AppContent: React.FC = () => {
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

      <ParticleNetwork />

      <div className="relative z-10">
        <Header onOpenPalette={() => setPaletteOpen(true)} />

        <main
          id="main-content"
          className="container mx-auto px-4 pt-24 pb-12 space-y-24 md:space-y-32"
        >
          <Hero />

          <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 transition-colors" />

          <Services />

          <TechStack />

          <Projects />

          <Contact />
        </main>

        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-900/50 mt-24">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              <p>&copy; {new Date().getFullYear()} Robel Fekadu. System Status: Operational.</p>
              <div className="flex items-center gap-6">
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

      {paletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}

      <SpeedInsights />
      <Analytics />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
