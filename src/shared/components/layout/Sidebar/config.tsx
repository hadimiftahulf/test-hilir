import {
  AppstoreOutlined,
  DashboardOutlined,
  TeamOutlined,
  WalletOutlined,
  FileProtectOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import type { MenuItem } from "../types/sidebar";

export const MENU: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "dashboard",
    icon: <DashboardOutlined />,
  },
  {
    key: "employees",
    label: "Employees",
    path: "employees",
    icon: <TeamOutlined />,
  },
  {
    key: "analytics",
    label: "Analytics",
    path: "analytics",
    icon: <AppstoreOutlined />,
  },
  {
    key: "payslips",
    label: "Payslips",
    path: "payslips",
    icon: <WalletOutlined />,
  },
  {
    key: "legal",
    label: "Legal",
    path: "legal",
    icon: <FileProtectOutlined />,
  },
];

export const SETTINGS_ITEM = {
  key: "settings",
  label: "Settings",
  path: "settings",
  icon: <SettingOutlined />,
};
