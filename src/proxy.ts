import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";

import { APP_ROUTES, PUBLIC_ROUTES, getRoutePermission } from "@/config/routes";

const intlMiddleware = createIntlMiddleware({
  locales: ["en", "id"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default async function proxy(req: NextRequest) {
  const { pathname, origin, search } = req.nextUrl;

  if (pathname === "/" || pathname === "") {
    return NextResponse.redirect(new URL("/en/auth/login" + search, origin));
  }
  const isSecure =
    process.env.NODE_ENV === "production" &&
    !process.env.NEXTAUTH_URL?.includes("http://localhost");

  const intlResponse = intlMiddleware(req);
  const localeMatch = pathname.match(/^\/(en|id)/);
  const locale = localeMatch?.[1] || "en";

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
  });
  const isLoggedIn = !!token;

  const cleanPath = pathname.replace(/^\/(en|id)/, "");

  const isPublicPage = PUBLIC_ROUTES.some((route) =>
    cleanPath.startsWith(route)
  );

  if (isPublicPage) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, origin));
    }

    return returnResponse(intlResponse, req);
  }

  const matchedRoute = getRoutePermission(pathname);

  if (matchedRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL(`/${locale}/auth/login`, origin);
      loginUrl.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(loginUrl);
    }
  }

  return returnResponse(intlResponse, req);
}

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
