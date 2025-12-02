// src/middleware.ts atau middleware.ts (di root project)
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

// Route yang butuh autentikasi
const PROTECTED_ROUTES = [
  /^\/(en|id)\/dashboard/,
  /^\/(en|id)\/employees/,
  /^\/(en|id)\/settings/,
  /^\/(en|id)\/reports/,
];

// Halaman login
const AUTH_ROUTES = [/^\/(en|id)\/auth\/login/, /^\/(en|id)\/login/];

// RBAC rules
const RBAC_RULES: Array<{ prefix: RegExp; roles: string[] }> = [
  { prefix: /^\/(en|id)\/dashboard\/admin/, roles: ["Admin"] },
  { prefix: /^\/(en|id)\/dashboard\/user/, roles: ["User", "Admin"] },
];

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};

export default async function proxy(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;
  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL("/en/auth/login" + search, origin));
  }
  if (pathname === "/en" || pathname === "/id") {
    const locale = pathname.slice(1) || "en";
    return NextResponse.redirect(
      new URL(`/${locale}/auth/login` + search, origin)
    );
  }

  // 1. Handle next-intl locale
  const intlResponse = intlMiddleware(req);

  // 2. Ambil token NextAuth
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    // PENTING: Tambahkan secureCookie jika production
    secureCookie: process.env.NODE_ENV === "production",
  });

  const isLoggedIn = !!token;

  // 3. Cek apakah route adalah auth page
  const isAuthRoute = AUTH_ROUTES.some((regex) => regex.test(pathname));

  // 4. Cek apakah route protected
  const isProtectedRoute = PROTECTED_ROUTES.some((regex) =>
    regex.test(pathname)
  );

  // Extract locale dari pathname
  const localeMatch = pathname.match(/^\/(en|id)/);
  const locale = localeMatch?.[1] || "en";

  // 5. Jika sudah login dan coba akses login page → redirect ke dashboard
  if (isAuthRoute && isLoggedIn) {
    console.log("🔒 User sudah login, redirect dari login ke dashboard");
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, origin));
  }

  // 6. Jika belum login dan akses protected route → redirect ke login
  if (isProtectedRoute && !isLoggedIn) {
    console.log("🚫 User belum login, redirect ke login");
    const loginUrl = new URL(`/${locale}/auth/login`, origin);
    loginUrl.searchParams.set("callbackUrl", pathname + search);
    return NextResponse.redirect(loginUrl);
  }

  // 7. RBAC check (jika sudah login)
  if (isLoggedIn && token.roles) {
    const userRoles = token.roles as string[];
    const rbacRule = RBAC_RULES.find((rule) => rule.prefix.test(pathname));

    if (rbacRule && !userRoles.some((role) => rbacRule.roles.includes(role))) {
      console.log("⛔ User tidak punya akses ke route ini");
      return NextResponse.redirect(new URL(`/${locale}/403`, origin));
    }
  }

  // 8. Set theme header
  const theme = req.cookies.get("theme")?.value || "light";
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-theme", theme);

  // 9. Return intl response dengan headers
  if (intlResponse) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });

    // Copy intl headers jika ada
    intlResponse.headers.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  }

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
