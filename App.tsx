import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { Header } from './src/components/layout/Header';
import { Hero } from './src/components/sections/Hero';
import { Services } from './src/components/sections/Services';
import { Projects } from './src/components/sections/Projects';
import { TechStack } from './src/components/sections/TechStack';
import { Contact } from './src/components/sections/Contact';
import { useKeyboardShortcut } from './src/hooks/useKeyboardShortcut';
import { KeyboardShortcutTooltip } from './src/components/ui/KeyboardShortcutTooltip';
import { ParticleNetwork } from './src/components/ui/ParticleNetwork';
import { CONTACT_EMAIL } from './src/data/constants';
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"

const AppContent: React.FC = () => {
  const { toggleTheme } = useTheme();
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect if device is desktop (not mobile/tablet)
  useEffect(() => {
    const checkIfDesktop = () => {
      // Check for touch capability and screen size
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isLargeScreen = window.innerWidth >= 1024;
      setIsDesktop(!hasTouch && isLargeScreen);
    };

    checkIfDesktop();
    window.addEventListener('resize', checkIfDesktop);
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);

  // Keyboard shortcut: Ctrl/Cmd + K
  useKeyboardShortcut({
    key: 'k',
    ctrlKey: true,
    metaKey: true, // This makes it work with both Ctrl (Windows/Linux) and Cmd (Mac)
    callback: () => {
      if (isDesktop) {
        toggleTheme();
        setShowTooltip(true);
      }
    },
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
        <Header />

        <main id="main-content" className="container mx-auto px-4 pt-24 pb-12 space-y-24 md:space-y-32">
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
                  href="https://github.com/robavelii"
                  target='_blank'
                  className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/robavelii"
                  target='_blank'
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

      {/* Keyboard shortcut tooltip - only shown on desktop */}
      {isDesktop && (
        <KeyboardShortcutTooltip show={showTooltip} onDismiss={() => setShowTooltip(false)} />
      )}
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
