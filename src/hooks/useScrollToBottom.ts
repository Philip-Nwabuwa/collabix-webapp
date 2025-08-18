import { useEffect, useRef } from 'react';

// Hook for automatically scrolling to bottom (useful for chat messages)
export function useScrollToBottom<T extends HTMLElement>(dependency?: any) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dependency]);

  const scrollToBottom = () => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  };

  return { ref, scrollToBottom };
}