import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API_INTERNAL_URL = (process.env.API_INTERNAL_URL ?? "").replace(
  /\/$/,
  ""
);

async function forward(req: Request, params: { path: string[] }) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const upstreamPath = params.path.join("/");
  const url = new URL(`${API_INTERNAL_URL}/${upstreamPath}`);
  const incoming = new URL(req.url);
  incoming.searchParams.forEach((v, k) => url.searchParams.append(k, v));

  const headers: Record<string, string> = {
    Accept: "application/json",
    Authorization: `Bearer ${session.accessToken}`,
  };
  // forward content-type if present
  const ct = req.headers.get("content-type");
  if (ct) headers["Content-Type"] = ct;

  const body = ["GET", "HEAD"].includes(req.method)
    ? undefined
    : await req.arrayBuffer();

  const res = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
    // optionally forward cookies if upstream needs them (careful)
  });

  const text = await res.text();
  let parsed: unknown = text ? JSON.parse(text) : {};
  return NextResponse.json(parsed, { status: res.status });
}

export const GET = (req: Request, ctx: any) => forward(req, ctx.params);
export const POST = (req: Request, ctx: any) => forward(req, ctx.params);
export const PUT = (req: Request, ctx: any) => forward(req, ctx.params);
export const DELETE = (req: Request, ctx: any) => forward(req, ctx.params);
