import { CurrentUser } from "@/types/auth";
import type { MenuProps, InputRef } from "antd";

export type NotificationItem = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread?: boolean;
};

export type HeaderProps = {
  user?: CurrentUser;
  notifications?: NotificationItem[];
  onSearch?: (q: string) => void;
};

export type AntMenuItems = MenuProps["items"];
export type InputRefType = InputRef;
