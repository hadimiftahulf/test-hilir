import { useAuthStore } from "@auth/stores/auth";

export function useAuth() {
  return useAuthStore();
}

export function useUser() {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated() {
  return useAuthStore((state) => state.isAuthenticated());
}
