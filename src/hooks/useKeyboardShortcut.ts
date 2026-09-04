import { useEffect, useRef } from 'react';

interface KeyboardShortcutOptions {
  key: string;
  /** Match Ctrl on Windows/Linux or Cmd on macOS. */
  modifier?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: (event: KeyboardEvent) => void;
  enabled?: boolean;
}

/** True while focus is somewhere that should keep its own key handling. */
const isTypingTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.getAttribute('role') === 'textbox'
  );
};

export const useKeyboardShortcut = ({
  key,
  modifier = false,
  shiftKey = false,
  altKey = false,
  callback,
  enabled = true,
}: KeyboardShortcutOptions) => {
  // Held in a ref so an inline arrow from the caller doesn't tear down and
  // re-attach the listener on every single render.
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (event.repeat) return;

      // Ctrl on Windows/Linux, Cmd on macOS - accept either, reject neither.
      const modifierHeld = event.ctrlKey || event.metaKey;
      if (modifier !== modifierHeld) return;
      if (event.shiftKey !== shiftKey) return;
      if (event.altKey !== altKey) return;
      if (!modifier && isTypingTarget(event.target)) return;

      event.preventDefault();
      callbackRef.current(event);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, modifier, shiftKey, altKey, enabled]);
};
