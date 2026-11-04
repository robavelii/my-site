import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { SiteShell } from './components/layout/SiteShell';
import { HomePage } from './home/HomePage';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <SiteShell page="home" mainClassName="home-main">
        <HomePage />
      </SiteShell>
    </ThemeProvider>
  );
};

export default App;
