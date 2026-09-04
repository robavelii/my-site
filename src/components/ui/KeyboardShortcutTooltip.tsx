import React, { useEffect } from 'react';
import { Command } from 'lucide-react';

interface KeyboardShortcutTooltipProps {
  show: boolean;
  onDismiss: () => void;
}

export const KeyboardShortcutTooltip: React.FC<KeyboardShortcutTooltipProps> = ({
  show,
  onDismiss,
}) => {
  const isMac =
    typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  // Auto-dismiss after 3s. `show` is owned by the parent, so there is no local
  // mirror of it to keep in sync.
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-4 py-3 rounded-lg shadow-lg border border-zinc-700 dark:border-zinc-300 flex items-center gap-3 max-w-sm">
        <Command className="w-5 h-5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium">Theme toggled!</p>
          <p className="text-xs opacity-80 mt-0.5">
            Press{' '}
            <kbd className="px-1.5 py-0.5 bg-zinc-800 dark:bg-zinc-200 rounded text-xs font-mono">
              {isMac ? '⌘' : 'Ctrl'}
            </kbd>{' '}
            +{' '}
            <kbd className="px-1.5 py-0.5 bg-zinc-800 dark:bg-zinc-200 rounded text-xs font-mono">
              K
            </kbd>{' '}
            to toggle
          </p>
        </div>
        <button
          onClick={onDismiss}
          className="text-zinc-400 dark:text-zinc-600 hover:text-zinc-200 dark:hover:text-zinc-800 transition-colors"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
