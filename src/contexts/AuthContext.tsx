import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCookie } from "@/hooks/useCookies";
import { useAuthStore } from "@/stores/authStore";
import { Loading } from "@/components/ui/loading";
import { setTokenRefreshCallback } from "@/lib/api";
import type { User } from "@/types/user";
import type { LoginResponse } from "@/types/auth";

const getTokenCookieOptions = () => ({
  secure: window.location.protocol === 'https:',
  sameSite: "lax" as const, // Changed from strict to lax for better compatibility
  path: "/",
  expires: new Date(Date.now() + 20 * 60 * 1000), // Extended to 20 minutes for buffer
});

export interface AuthContextValue {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  login: (loginResponse: LoginResponse) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updateToken: (newToken: string) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  const [token, setTokenCookie, removeTokenCookie] = useCookie<string | null>(
    "auth_token",
    null,
    getTokenCookieOptions()
  );

  const { user, isAuthenticated, setUser, clearUser, updateUser } =
    useAuthStore();

  const login = useCallback(
    (loginResponse: LoginResponse) => {
      // Use the hook consistently instead of manual cookie setting
      setTokenCookie(loginResponse.accessToken);
      setUser(loginResponse.user);
    },
    [setTokenCookie, setUser]
  );

  const logout = useCallback(() => {
    removeTokenCookie();
    clearUser();
  }, [removeTokenCookie, clearUser]);

  const updateUserInfo = useCallback(
    (updates: Partial<User>) => {
      updateUser(updates);
    },
    [updateUser]
  );

  const updateToken = useCallback(
    (newToken: string) => {
      // Use the hook consistently instead of manual cookie setting
      setTokenCookie(newToken);
    },
    [setTokenCookie]
  );

  // Determine authentication state - all conditions must be met
  const isFullyAuthenticated = Boolean(token && isAuthenticated && user);

  // Register token refresh callback with API client
  useEffect(() => {
    setTokenRefreshCallback(updateToken);
  }, [updateToken]);

  // Initialize authentication state and handle routing
  useEffect(() => {
    // Synchronously determine the authentication state
    const initializeAuth = async () => {
      // Allow a brief moment for Zustand hydration and cookie reading
      await new Promise((resolve) => setTimeout(resolve, 50));

      const isLoginPage = location.pathname === "/login";

      // Handle routing based on authentication state
      if (isFullyAuthenticated && isLoginPage) {
        navigate("/workspaces", { replace: true });
      } else if (!isFullyAuthenticated && !isLoginPage) {
        navigate("/login", { replace: true });
      }

      // Only stop loading after routing is determined
      setIsLoading(false);
    };

    initializeAuth();
  }, [isFullyAuthenticated, location.pathname, navigate]);

  // Show loading overlay during auth initialization to prevent flash
  if (isLoading) {
    return <Loading aria-label="Initializing authentication" />;
  }

  const contextValue: AuthContextValue = {
    // State
    user,
    token,
    isAuthenticated: isFullyAuthenticated,
    isLoading,

    // Actions
    login,
    logout,
    updateUser: updateUserInfo,
    updateToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
