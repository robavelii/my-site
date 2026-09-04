import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Check,
  Copy,
  Download,
  Github,
  Laptop,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
} from 'lucide-react';
import { CONTACT_EMAIL, SECTIONS, SOCIAL } from '../../data/constants';
import { useTheme } from '../../context/ThemeContext';

interface Command {
  id: string;
  label: string;
  hint?: string;
  group: 'Navigate' | 'Theme' | 'Actions';
  icon: React.ElementType;
  run: () => void;
  keepOpen?: boolean;
}

interface CommandPaletteProps {
  onClose: () => void;
}

/** Mounted only while open, so every open starts from clean state. */
export const CommandPalette: React.FC<CommandPaletteProps> = ({ onClose }) => {
  const { theme, setTheme } = useTheme();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => {
    const nav: Command[] = SECTIONS.map((s) => ({
      id: `nav-${s.id}`,
      label: s.label,
      hint: `#${s.id}`,
      group: 'Navigate',
      icon: ArrowRight,
      run: () => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' }),
    }));

    return [
      ...nav,
      {
        id: 'theme-light',
        label: 'Light theme',
        hint: theme === 'light' ? 'current' : undefined,
        group: 'Theme',
        icon: Sun,
        run: () => setTheme('light'),
      },
      {
        id: 'theme-dark',
        label: 'Dark theme',
        hint: theme === 'dark' ? 'current' : undefined,
        group: 'Theme',
        icon: Moon,
        run: () => setTheme('dark'),
      },
      {
        id: 'theme-system',
        label: 'Match system theme',
        hint: theme === 'system' ? 'current' : undefined,
        group: 'Theme',
        icon: Laptop,
        run: () => setTheme('system'),
      },
      {
        id: 'copy-email',
        label: copied ? 'Email copied' : 'Copy email address',
        hint: CONTACT_EMAIL,
        group: 'Actions',
        icon: copied ? Check : Copy,
        keepOpen: true,
        run: () => {
          void navigator.clipboard?.writeText(CONTACT_EMAIL).then(() => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1600);
          });
        },
      },
      {
        id: 'email',
        label: 'Send an email',
        group: 'Actions',
        icon: Mail,
        run: () => {
          window.location.href = `mailto:${CONTACT_EMAIL}`;
        },
      },
      {
        id: 'resume',
        label: 'Download résumé',
        hint: 'PDF',
        group: 'Actions',
        icon: Download,
        run: () => {
          const a = document.createElement('a');
          a.href = '/resume.pdf';
          a.download = '';
          a.click();
        },
      },
      {
        id: 'github',
        label: 'Open GitHub',
        hint: '@robavelii',
        group: 'Actions',
        icon: Github,
        run: () => window.open(SOCIAL.github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'linkedin',
        label: 'Open LinkedIn',
        hint: '/in/robavelii',
        group: 'Actions',
        icon: Linkedin,
        run: () => window.open(SOCIAL.linkedin, '_blank', 'noopener,noreferrer'),
      },
    ];
  }, [theme, setTheme, copied]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter(
      (c) => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)
    );
  }, [commands, query]);

  // Take focus, lock background scroll, and hand focus back on unmount.
  useEffect(() => {
    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    const raf = requestAnimationFrame(() => inputRef.current?.focus());

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus?.();
    };
  }, []);

  const runCommand = useCallback(
    (command: Command) => {
      command.run();
      if (!command.keepOpen) onClose();
    },
    [onClose]
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault();
      setActive((i) => (results.length ? (i + 1) % results.length : 0));
      return;
    }
    if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      setActive((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
      return;
    }
    if (event.key === 'Enter' && results[active]) {
      event.preventDefault();
      runCommand(results[active]);
    }
  };

  // Keep the highlighted row in view when arrowing past the fold.
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  let lastGroup = '';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
      onKeyDown={onKeyDown}
    >
      <div
        className="absolute inset-0 bg-zinc-950/50 backdrop-blur-sm animate-in fade-in duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="relative w-full max-w-lg overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-150"
      >
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4">
          <Search
            className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder="Jump to a section, switch theme, get in touch…"
            aria-label="Search commands"
            aria-controls="command-results"
            className="h-12 w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-zinc-200 dark:border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500 dark:text-zinc-400 sm:block">
            esc
          </kbd>
        </div>

        <div
          id="command-results"
          ref={listRef}
          role="listbox"
          className="max-h-80 overflow-y-auto p-2"
        >
          {results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Nothing matches “{query}”.
            </p>
          )}

          {results.map((command, i) => {
            const Icon = command.icon;
            const showGroup = command.group !== lastGroup;
            lastGroup = command.group;
            return (
              <React.Fragment key={command.id}>
                {showGroup && (
                  <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-zinc-500 dark:text-zinc-400 first:pt-1">
                    {command.group}
                  </div>
                )}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  data-active={i === active}
                  onMouseMove={() => setActive(i)}
                  onClick={() => runCommand(command)}
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-left text-sm transition-colors ${
                    i === active
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  <Icon
                    className="h-4 w-4 shrink-0 text-zinc-500 dark:text-zinc-400"
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{command.label}</span>
                  {command.hint && (
                    <span className="shrink-0 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                      {command.hint}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        <div className="flex items-center gap-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2 font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
};
