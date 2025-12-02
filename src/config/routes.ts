export type AppRoute = {
  path: string;
  permission?: string; // Key permission dari database (cth: 'users:read:any')
};

// 1. Route Publik (Tidak butuh login)
export const PUBLIC_ROUTES = [
  "/auth/login",
  "/auth/register",
  "/privacy",
  "/terms",
];

// 2. Route Terproteksi (Butuh Login + Cek Permission)
// Ini adalah "Master Data" untuk Middleware & Sidebar
export const APP_ROUTES: AppRoute[] = [
  {
    path: "/dashboard",
    permission: "dashboard:read:any",
  },
  {
    path: "/users",
    permission: "users:read:any",
  },
  {
    path: "/roles",
    permission: "roles:read:any",
  },
  {
    path: "/calculate",
    permission: "calculate:read:any",
  },
  {
    path: "/settings",
    permission: "settings:read:own",
  },
  {
    path: "/reports",
    permission: "reports:read:any",
  },
];

// Helper untuk cek apakah path butuh permission tertentu
export function getRoutePermission(pathname: string): string | undefined {
  // Hapus locale (misal /en/users -> /users) agar pencocokan mudah
  const cleanPath = pathname.replace(/^\/(en|id)/, "") || "/";

  // Cari route yang cocok (startsWith agar sub-route seperti /users/new juga kena)
  const route = APP_ROUTES.find(
    (r) => cleanPath === r.path || cleanPath.startsWith(`${r.path}/`)
  );

  return route?.permission;
}
