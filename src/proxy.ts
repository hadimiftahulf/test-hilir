import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
// 👇 Import Config Pusat
import { APP_ROUTES, PUBLIC_ROUTES, getRoutePermission } from "@/config/routes";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function proxy(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  // --- 1. Handle Root Redirect ---
  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL("/en/auth/login" + search, origin));
  }
  const isSecure =
    process.env.NODE_ENV === "production" &&
    !process.env.NEXTAUTH_URL?.includes("http://localhost");

  // --- 2. Handle Locale & Intl ---
  const intlResponse = intlMiddleware(req);
  const localeMatch = pathname.match(/^\/(en|id)/);
  const locale = localeMatch?.[1] || "en";

  // --- 3. Cek Status Login ---
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });
  const isLoggedIn = !!token;

  // Bersihkan path dari locale untuk pengecekan logic (misal: /en/users -> /users)
  const cleanPath = pathname.replace(/^\/(en|id)/, "");

  // --- 4. Logic: Public Routes (Login/Register) ---
  const isPublicPage = PUBLIC_ROUTES.some((route) =>
    cleanPath.startsWith(route)
  );

  if (isPublicPage) {
    if (isLoggedIn) {
      // Jika sudah login tapi buka halaman login, lempar ke dashboard
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, origin));
    }
    // Jika belum login, biarkan akses halaman public
    return returnResponse(intlResponse, req);
  }

  // --- 5. Logic: Protected Routes ---
  // Cek apakah path ini ada di daftar APP_ROUTES
  const matchedRoute = getRoutePermission(pathname);

  if (matchedRoute) {
    // A. Cek Login
    if (!isLoggedIn) {
      const loginUrl = new URL(`/${locale}/auth/login`, origin);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Lolos semua cek
  return returnResponse(intlResponse, req);
}

// Helper agar tidak duplikat logic return
function returnResponse(intlResponse: NextResponse, req: NextRequest) {
  const theme = req.cookies.get("theme")?.value || "light";
  const response = intlResponse || NextResponse.next();
  response.headers.set("x-theme", theme);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
