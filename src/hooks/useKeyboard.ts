import { useEffect } from 'react';

// Hook for handling keyboard shortcuts and key events
export function useKeyboard(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options?: {
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
  }
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { ctrl = false, shift = false, alt = false, meta = false } = options || {};
      
      const isTargetKey = event.key.toLowerCase() === key.toLowerCase();
      const isCtrlMatch = ctrl === event.ctrlKey;
      const isShiftMatch = shift === event.shiftKey;
      const isAltMatch = alt === event.altKey;
      const isMetaMatch = meta === event.metaKey;
      
      if (isTargetKey && isCtrlMatch && isShiftMatch && isAltMatch && isMetaMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, callback, options]);
}