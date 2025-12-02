import "server-only";
import { NextResponse } from "next/server";

const SESSION_COOKIE = "session";
const MAX_AGE = 60 * 60 * 24 * 7;

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role?: string;
};

function parseToken(token: string | undefined | null): SessionUser | null {
  if (!token) return null;
  try {
    const json = Buffer.from(token, "base64").toString("utf8");
    return JSON.parse(json) as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser(): Promise<SessionUser | null> {
  try {
    const mod = await import("next/headers");
    const cookieStore = await mod.cookies();
    const token =
      typeof cookieStore?.get === "function"
        ? cookieStore.get(SESSION_COOKIE)?.value
        : null;
    return parseToken(token);
  } catch {
    return null;
  }
}

export function setCookieOnResponse(user: SessionUser) {
  const token = Buffer.from(JSON.stringify(user)).toString("base64");
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: MAX_AGE,
    path: "/",
  });
  return res;
}
export function clearCookieOnResponse() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  return res;
}
