import { useState, useCallback } from 'react';

// Hook for managing boolean toggle state with convenient methods
export function useToggle(initialValue = false): [boolean, () => void, (value?: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue(prev => !prev), []);
  
  const set = useCallback((newValue?: boolean) => {
    setValue(newValue !== undefined ? newValue : !value);
  }, [value]);

  return [value, toggle, set];
}