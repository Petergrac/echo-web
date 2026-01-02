import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "@/lib/api/axios";
import { UserType } from "@/types/user-type";
import { useMemo } from "react";

interface AuthState {
  //* User state
  user: UserType | null;
  isLoading: boolean;
  error: string | null;

  //* Auth state
  isAuthenticated: boolean;
  lastFetched: number | null;

  //* Actions
  setUser: (user: UserType | null) => void;
  clearUser: () => void;
  fetchCurrentUser: (force?: boolean) => Promise<UserType | null>;
  updateUser: (updates: Partial<UserType>) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getFullName: () => string;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      //* Initial state
      user: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,
      lastFetched: null,

      //* Actions
      setUser: (user) => {
        set({
          user,
          isAuthenticated: !!user,
          lastFetched: user ? Date.now() : null,
          error: null,
        });
      },

      clearUser: () => {
        set({
          user: null,
          isAuthenticated: false,
          lastFetched: null,
          error: null,
        });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },

      fetchCurrentUser: async (force = false) => {
        const state = get();

        //* Cache for 5 minutes unless forced
        const FIVE_MINUTES = 5 * 60 * 1000;
        const now = Date.now();
        if (
          !force &&
          state.user &&
          state.lastFetched &&
          now - state.lastFetched < FIVE_MINUTES
        ) {
          return state.user;
        }

        set({ isLoading: true, error: null });

        try {
          const response = await api.get("/users/me");
          const userData = response.data;

          const user: UserType = {
            ...userData,
            createdAt: new Date(userData.createdAt),
          };

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            lastFetched: Date.now(),
            error: null,
          });

          return user;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          console.error("Failed to fetch user:", error);

          let errorMessage = "Failed to load user profile";

          if (error.response?.status === 401) {
            errorMessage = "Session expired";
            set({ user: null, isAuthenticated: false });
          } else if (error.response?.status === 404) {
            errorMessage = "User profile not found";
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          }

          set({
            error: errorMessage,
            isLoading: false,
          });

          throw error;
        }
      },

      refreshUser: async () => {
        //* Force refresh user data
        await get().fetchCurrentUser(true);
      },

      logout: async () => {
        const { user } = get();
        if (!user) return;
        //* Clear local state
        set({
          user: null,
          isAuthenticated: false,
          lastFetched: null,
          error: null,
        });
        //* Clear persisted storage
        localStorage.removeItem("auth-storage");
        sessionStorage.clear();
        return;
      },

      //* Helper methods
      getFullName: () => {
        const { user } = get();
        if (!user) return "";
        return `${user.firstName} ${user.lastName}`.trim();
      },

      hasPermission: (permission: string) => {
        const { user } = get();
        // Implement permission logic based on user role/permissions
        // This is a placeholder - adjust based on your backend
        if (!user) return false;

        // Example: Check if user has admin role
        // return user.role === 'admin';
        return false;
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        lastFetched: state.lastFetched,
      }),
      version: 1,
    }
  )
);

//* Custom hooks
export const useCurrentUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
export const useAuthActions = () => {
  const store = useAuthStore();

  return useMemo(
    () => ({
      fetchCurrentUser: store.fetchCurrentUser,
      logout: store.logout,
      updateUser: store.updateUser,
      refreshUser: store.refreshUser,
      setUser: store.setUser,
      clearUser: store.clearUser,
    }),
    [store]
  );
};
export const useUserFullName = () =>
  useAuthStore((state) => state.getFullName());

