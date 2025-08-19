import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Protected route wrapper that only renders when authenticated - AuthProvider handles loading and routing
export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Don't render anything while auth is initializing - AuthProvider shows loading
  if (isLoading) {
    return null;
  }

  // Only render children if authenticated - AuthProvider handles redirect to login
  if (!isAuthenticated) {
    return fallback || null;
  }

  return <>{children}</>;
}
