import { useState, useCallback, useEffect } from 'react';

// Cookie configuration options interface
export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean; // Note: httpOnly can't be set from client-side JavaScript
}

// Default cookie options - consistent with AuthContext
const defaultOptions: CookieOptions = {
  path: '/',
  sameSite: 'lax', // Consistent configuration for better compatibility
  secure: window.location.protocol === 'https:', // Environment-aware secure flag
};

// Utility function to parse cookies from document.cookie
function parseCookies(): Record<string, string> {
  if (typeof document === 'undefined') return {};
  
  return document.cookie
    .split(';')
    .reduce((cookies, cookie) => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
      return cookies;
    }, {} as Record<string, string>);
}

// Utility function to set a cookie
function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return;
  
  const mergedOptions = { ...defaultOptions, ...options };
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
  
  if (mergedOptions.expires) {
    const expiresDate = typeof mergedOptions.expires === 'number'
      ? new Date(Date.now() + mergedOptions.expires * 24 * 60 * 60 * 1000)
      : mergedOptions.expires;
    cookieString += `; expires=${expiresDate.toUTCString()}`;
  }
  
  if (mergedOptions.path) {
    cookieString += `; path=${mergedOptions.path}`;
  }
  
  if (mergedOptions.domain) {
    cookieString += `; domain=${mergedOptions.domain}`;
  }
  
  if (mergedOptions.secure) {
    cookieString += '; secure';
  }
  
  if (mergedOptions.sameSite) {
    cookieString += `; samesite=${mergedOptions.sameSite}`;
  }
  
  document.cookie = cookieString;
}

// Utility function to remove a cookie
function removeCookie(name: string, options: Omit<CookieOptions, 'expires'> = {}): void {
  setCookie(name, '', { ...options, expires: new Date(0) });
}

// Utility function to serialize values to JSON with error handling
function serializeValue<T>(value: T): string {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.error(`Error serializing cookie value:`, error);
    return String(value);
  }
}

// Utility function to deserialize values from JSON with error handling
function deserializeValue<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value);
  } catch (error) {
    // If JSON parsing fails, try to return the original string value
    // This handles cases where the cookie contains plain text
    if (typeof fallback === 'string') {
      return value as unknown as T;
    }
    console.error(`Error deserializing cookie value:`, error);
    return fallback;
  }
}

// Hook for managing a single cookie with React state synchronization
export function useCookie<T>(
  name: string,
  initialValue: T,
  options: CookieOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Initialize state with cookie value or fallback to initial value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const cookies = parseCookies();
      const cookieValue = cookies[name];
      return cookieValue !== undefined 
        ? deserializeValue(cookieValue, initialValue)
        : initialValue;
    } catch (error) {
      console.error(`Error reading cookie "${name}":`, error);
      return initialValue;
    }
  });

  // Update cookie and state
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setCookie(name, serializeValue(valueToStore), options);
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
    }
  }, [name, storedValue, options]);

  // Remove cookie and reset to initial value
  const removeCookieValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      removeCookie(name, options);
    } catch (error) {
      console.error(`Error removing cookie "${name}":`, error);
    }
  }, [name, initialValue, options]);

  return [storedValue, setValue, removeCookieValue];
}

// Hook for managing multiple cookies
export function useCookies(
  names?: string[]
): [Record<string, string>, (name: string, value: string, options?: CookieOptions) => void, (name: string, options?: Omit<CookieOptions, 'expires'>) => void] {
  const [cookies, setCookiesState] = useState<Record<string, string>>(() => {
    const allCookies = parseCookies();
    return names ? 
      Object.fromEntries(names.map(name => [name, allCookies[name] || ''])) :
      allCookies;
  });

  // Listen for cookie changes (useful for cross-tab synchronization)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedCookies = parseCookies();
      const filteredCookies = names ?
        Object.fromEntries(names.map(name => [name, updatedCookies[name] || ''])) :
        updatedCookies;
      setCookiesState(filteredCookies);
    };

    // Listen for storage events (limited cross-tab support for cookies)
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [names]);

  // Set a cookie
  const setCookieValue = useCallback((name: string, value: string, options: CookieOptions = {}) => {
    try {
      setCookie(name, value, options);
      setCookiesState(prev => ({ ...prev, [name]: value }));
    } catch (error) {
      console.error(`Error setting cookie "${name}":`, error);
    }
  }, []);

  // Remove a cookie
  const removeCookieValue = useCallback((name: string, options: Omit<CookieOptions, 'expires'> = {}) => {
    try {
      removeCookie(name, options);
      setCookiesState(prev => {
        const newCookies = { ...prev };
        delete newCookies[name];
        return newCookies;
      });
    } catch (error) {
      console.error(`Error removing cookie "${name}":`, error);
    }
  }, []);

  return [cookies, setCookieValue, removeCookieValue];
}

// Hook for managing typed cookie values with automatic serialization
export function useTypedCookie<T>(
  name: string,
  initialValue: T,
  options: CookieOptions = {}
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  return useCookie<T>(name, initialValue, options);
}