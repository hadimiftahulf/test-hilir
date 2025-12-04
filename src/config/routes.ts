export type AppRoute = {
  path: string;
  permission?: string;
};

export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/privacy",
  "/terms",
];

export const APP_ROUTES: AppRoute[] = [
  {
    path: "/dashboard",
    permission: "dashboard:read",
  },
  {
    path: "/users",
    permission: "users:read",
  },
  {
    path: "/roles",
    permission: "roles:read",
  },
  {
    path: "/calculate",
    permission: "calculate:read",
  },
  {
    path: "/settings",
    permission: "settings:read",
  },
  {
    path: "/reports",
    permission: "reports",
  },
];

export function getRoutePermission(pathname: string): string | undefined {
  const cleanPath = pathname.replace(/^\/(en|id)/, "") || "/";

  const route = APP_ROUTES.find(
    (r) => cleanPath === r.path || cleanPath.startsWith(`${r.path}/`)
  );

  return route?.permission;
}
