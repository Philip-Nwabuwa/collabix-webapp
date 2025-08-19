import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types/user";

// Auth store state interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Auth store actions interface
interface AuthActions {
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updates: Partial<User>) => void;
}

// Combined auth store type
type AuthStore = AuthState & AuthActions;

// Create the auth store with persistence for user data only (not token)
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,

      // Actions
      setUser: (user: User) =>
        set({
          user,
          isAuthenticated: true,
        }),

      clearUser: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },
    }),
    {
      name: "auth-storage", // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);