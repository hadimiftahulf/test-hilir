import * as React from "react";
import type { TodayAttendance } from "../types/sidebar";

export function useAttendance(initial: TodayAttendance = { status: "none" }) {
  const [att, setAtt] = React.useState<TodayAttendance>(initial);
  const [loadingIn, setLoadingIn] = React.useState(false);
  const [loadingOut, setLoadingOut] = React.useState(false);

  const canCheckIn = att.status === "none";
  const canCheckOut = att.status === "checked_in";

  async function handleClockIn() {
    try {
      setLoadingIn(true);
      const res = await fetch("/api/attendance/clock-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("clock-in failed");
      const data: TodayAttendance = await res.json();
      setAtt({
        status: "checked_in",
        clockInAt: data.clockInAt || new Date().toISOString(),
        mode: data.mode,
        locationLabel: data.locationLabel,
      });
    } finally {
      setLoadingIn(false);
    }
  }

  async function handleClockOut() {
    try {
      setLoadingOut(true);
      const res = await fetch("/api/attendance/clock-out", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ at: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("clock-out failed");
      const data: TodayAttendance = await res.json();
      setAtt((prev) => ({
        ...prev,
        status: "checked_out",
        clockOutAt: data.clockOutAt || new Date().toISOString(),
      }));
    } finally {
      setLoadingOut(false);
    }
  }

  return {
    att,
    setAtt,
    loadingIn,
    loadingOut,
    canCheckIn,
    canCheckOut,
    handleClockIn,
    handleClockOut,
  };
}
