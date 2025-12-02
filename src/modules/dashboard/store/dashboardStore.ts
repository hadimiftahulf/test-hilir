"use client";

import { create } from "zustand";
import type {
  Kpi,
  EventItem,
  ActivityItem,
  TaskItem,
  PayslipItem,
} from "../types/dashbordTypes";

type State = {
  greeting: string;
  days: string;
  kpis: Kpi[];
  eventsToday: EventItem[];
  activities: ActivityItem[];
  tasks: TaskItem[];
  payslips: PayslipItem[];
};

type Actions = {
  setGreeting: (g: string) => void;
  hydrate: (payload: Partial<State>) => void;
  setDays: (d: string) => void;
};

export const useDashboardStore = create<State & Actions>((set) => ({
  greeting: "",
  kpis: [],
  days: "",
  eventsToday: [],
  activities: [],
  tasks: [],
  payslips: [],
  setGreeting: (g) => set({ greeting: g }),
  setDays: (g) => set({ days: g }),
  hydrate: (payload) => set((s) => ({ ...s, ...payload })),
}));
