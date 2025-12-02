import {
  DashboardOutlined,
  UserOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { APP_ROUTES } from "@/config/routes"; // 👈 Import SSOT

// Helper untuk cari config route berdasarkan path
const getRoute = (pathKey: string) =>
  APP_ROUTES.find((r) => r.path === pathKey);

export const MENU = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <DashboardOutlined />,
    ...getRoute("/dashboard"),
  },
  {
    key: "users",
    label: "Employees",
    icon: <UserOutlined />,
    ...getRoute("/users"),
  },
  {
    key: "roles",
    label: "Roles & Access",
    icon: <SafetyCertificateOutlined />,
    ...getRoute("/roles"),
  },
  {
    key: "calculate",
    label: "Calculate",
    icon: <BarChartOutlined />,
    ...getRoute("/calculate"),
  },
  {
    key: "reports",
    label: "Reports",
    icon: <BarChartOutlined />,
    ...getRoute("/reports"),
  },
];

export const SETTINGS_ITEM = {
  key: "settings",
  label: "Settings",
  icon: <SettingOutlined />,
  path: getRoute("/settings")?.path as string,
  ...getRoute("/settings"),
};
