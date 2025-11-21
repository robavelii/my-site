import { useEffect } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
}

export const useKeyboardShortcut = ({
  key,
  ctrlKey = false,
  metaKey = false,
  shiftKey = false,
  altKey = false,
  callback,
}: KeyboardShortcutOptions) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if all modifier keys match
      const ctrlMatch = ctrlKey ? event.ctrlKey : !event.ctrlKey;
      const metaMatch = metaKey ? event.metaKey : !event.metaKey;
      const shiftMatch = shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatch = altKey ? event.altKey : !event.altKey;

      // For Ctrl/Cmd + K, we want either Ctrl (Windows/Linux) or Cmd (Mac)
      const modifierMatch = (ctrlKey || metaKey) 
        ? (event.ctrlKey || event.metaKey) 
        : ctrlMatch && metaMatch;

      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        modifierMatch &&
        shiftMatch &&
        altMatch
      ) {
        event.preventDefault();
        callback();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrlKey, metaKey, shiftKey, altKey, callback]);
};
