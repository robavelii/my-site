import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const Header: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef<HTMLDivElement>(null);

  // Click outside to close theme menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target as Node)) {
        setIsThemeMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md h-14 flex items-center justify-between px-4 md:px-6 lg:px-8 transition-colors">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-zinc-500">
        <span className="text-zinc-400 dark:text-zinc-500">sys</span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="hover:text-zinc-900 dark:hover:text-zinc-300 cursor-pointer transition-colors">
          portfolio
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">/</span>
        <span className="text-emerald-600 dark:text-emerald-500 font-medium">main</span>
      </div>

      {/* Status & Controls */}
      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full transition-colors">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-600 dark:text-emerald-500 font-medium">
            System Online
          </span>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-zinc-400 dark:text-zinc-500">
          <span>v2.4.0</span>
          <Monitor className="w-4 h-4" />
        </div>

        {/* Theme Toggle with Keyboard Shortcut Hint */}
        <div className="relative group" ref={themeMenuRef}>
          <button
            onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-600"
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>

          {/* Keyboard Shortcut Hint - Desktop Only */}
          <div className="hidden md:block absolute -bottom-12 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
            <div className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-2 py-1 rounded text-xs font-mono whitespace-nowrap">
              <kbd className="px-1 bg-zinc-800 dark:bg-zinc-200 rounded">
                {typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘' : 'Ctrl'}
              </kbd>
              {' + '}
              <kbd className="px-1 bg-zinc-800 dark:bg-zinc-200 rounded">K</kbd>
            </div>
          </div>

          {isThemeMenuOpen && (
            <div className="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="py-1">
                <button
                  onClick={() => {
                    setTheme('light');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'light' ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-700 dark:text-zinc-400'} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
                >
                  <Sun className="mr-2 h-4 w-4" /> Light
                </button>
                <button
                  onClick={() => {
                    setTheme('dark');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'dark' ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-700 dark:text-zinc-400'} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
                >
                  <Moon className="mr-2 h-4 w-4" /> Dark
                </button>
                <button
                  onClick={() => {
                    setTheme('system');
                    setIsThemeMenuOpen(false);
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm ${theme === 'system' ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900' : 'text-zinc-700 dark:text-zinc-400'} hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors`}
                >
                  <Laptop className="mr-2 h-4 w-4" /> System
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
