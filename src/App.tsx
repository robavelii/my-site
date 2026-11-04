import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SiteShell } from './components/layout/SiteShell';
import { Hero } from './components/sections/Hero';
import { Services } from './components/sections/Services';
import { Projects } from './components/sections/Projects';
import { TechStack } from './components/sections/TechStack';
import { Contact } from './components/sections/Contact';
import { ParticleNetwork } from './components/ui/ParticleNetwork';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SiteShell
        page="home"
        backdrop={<ParticleNetwork />}
        mainClassName="container mx-auto px-4 pt-24 pb-12 space-y-16 md:space-y-24"
      >
        <Hero />

        <div className="w-full h-px bg-zinc-200 dark:bg-zinc-800 transition-colors" />

        <Services />

        <TechStack />

        <Projects />

        <Contact />
      </SiteShell>
    </ThemeProvider>
  );
};

export default App;
