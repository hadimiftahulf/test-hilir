import { create } from "zustand";

type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: string;
  parentId?: string | null;
};
type State = {
  menus: MenuItem[];
  loading: boolean;
  fetch: () => Promise<void>;
};

export const useMe = create<State>((set) => ({
  menus: [],
  loading: false,
  fetch: async () => {
    set({ loading: true });
    const r = await fetch("/api/me/menus", { cache: "no-store" });
    const j = await r.json().catch(() => ({}));
    set({ menus: j?.data || [], loading: false });
  },
}));
