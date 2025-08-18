import { useRef, useEffect } from "react";

// Hook for keeping track of the previous value of a state or prop
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>(value);

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}
