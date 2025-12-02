// src/hooks/useAuth.ts

import { useAuthStore } from "@auth/stores/auth";

export function useAuth() {
  return useAuthStore();
}

// Shortcut hooks untuk performance
export function useUser() {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated());
}
