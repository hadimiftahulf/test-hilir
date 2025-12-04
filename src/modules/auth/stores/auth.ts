"use client";
import { create } from "zustand";
import type { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import { CurrentUser } from "@/types/auth";

type AuthState = {
  user: CurrentUser | null;
  loading: boolean;
  setUser: (u: CurrentUser | null) => void;
  bootstrap: () => Promise<void>;
  login: (p: {
    email: string;
    password: string;
    remember?: boolean;
  }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;

  isAuthenticated: () => boolean;
};

async function fetchSession(): Promise<Session | null> {
  const r = await fetch("/api/auth/session", {
    cache: "no-store",
    credentials: "include",
  });
  if (!r.ok) return null;
  return r.json().catch(() => null);
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  setUser: (u) => set({ user: u }),
  bootstrap: async () => {
    set({ loading: true });
    try {
      const s = await fetchSession();
      const u = s?.user as unknown as CurrentUser | null;
      set({
        user: u
          ? {
              id: u.id,
              email: u.email!,
              name: u.name,
              roles: u.roles,
              avatarUrl: u.avatarUrl,
            }
          : null,
      });
    } finally {
      set({ loading: false });
    }
  },
  login: async ({ email, password, remember }) => {
    set({ loading: true });
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (!res || res.error)
        return { ok: false, message: res?.error || "Invalid credentials" };
      const s = await fetchSession();
      const u = s?.user as unknown as CurrentUser | null;
      set({
        user: u
          ? {
              id: u.id,
              email: u.email!,
              name: u.name,
              roles: u.roles,
              avatarUrl: u.avatarUrl,
            }
          : null,
      });
      return { ok: true };
    } finally {
      set({ loading: false });
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await signOut({ redirect: false });
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  isAuthenticated: () => !!get().user,
}));
