import React, { useEffect, useRef, useState } from 'react';
import { Laptop, Moon, Search, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SECTIONS } from '../../data/constants';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Laptop },
] as const;

interface HeaderProps {
  onOpenPalette: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPalette }) => {
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  // userAgentData is the non-deprecated replacement for navigator.platform.
  const [isMac] = useState(() => {
    const ua = navigator as Navigator & { userAgentData?: { platform?: string } };
    return /mac/i.test(ua.userAgentData?.platform ?? navigator.userAgent);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  // Scroll-spy: highlight whichever section currently owns the viewport.
  useEffect(() => {
    // Degrade to no highlight rather than throwing during mount, which would
    // take the whole tree down with it.
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0.1, 0.5] }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Main"
      className="fixed top-0 w-full z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md h-14 flex items-center justify-between gap-4 px-4 md:px-6 lg:px-8 transition-colors"
    >
      <a
        href="#main-content"
        className="font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100 shrink-0"
      >
        robel<span className="text-emerald-700 dark:text-emerald-400">.</span>
      </a>

      <ul className="hidden md:flex items-center gap-1 text-sm">
        {SECTIONS.map(({ id, label }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={activeSection === id ? 'true' : undefined}
              className={`block rounded px-3 py-1.5 font-mono text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                activeSection === id
                  ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-800'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onOpenPalette}
          className="flex items-center gap-2 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 h-9 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Open command palette</span>
          <kbd className="hidden sm:block font-mono text-[10px] tracking-wide" aria-hidden="true">
            {isMac ? '⌘' : 'Ctrl'} K
          </kbd>
        </button>

        <div className="relative" ref={menuRef}>
          <button
            ref={triggerRef}
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Change theme"
            className="flex items-center justify-center w-9 h-9 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] dark:hidden" aria-hidden="true" />
            <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block" aria-hidden="true" />
          </button>

          {menuOpen && (
            <div
              role="menu"
              aria-label="Theme"
              className="absolute right-0 mt-2 w-36 origin-top-right overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-lg z-50 animate-in fade-in zoom-in-95 duration-100"
            >
              {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={theme === value}
                  onClick={() => {
                    setTheme(value);
                    setMenuOpen(false);
                    triggerRef.current?.focus();
                  }}
                  className={`flex w-full items-center px-4 py-2 text-sm transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus-visible:bg-zinc-100 dark:focus-visible:bg-zinc-800 ${
                    theme === value
                      ? 'text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon className="mr-2 h-4 w-4" aria-hidden="true" /> {label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
