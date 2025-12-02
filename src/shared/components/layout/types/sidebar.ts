import React from "react";

export type MenuItem = {
  key: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: number;
};

export type TodayAttendance = {
  status: "none" | "checked_in" | "checked_out";
  clockInAt?: string;
  clockOutAt?: string;
  mode?: "WFO" | "WFH";
  locationLabel?: string;
};
