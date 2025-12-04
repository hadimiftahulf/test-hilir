import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import { verifyUserLogin } from "@/server/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const user = await verifyUserLogin(email, password);

    if (!user) {
      return NextResponse.json(
        { error: "Email atau Password salah" },
        { status: 401 }
      );
    }

    const token = await encode({
      token: {
        uid: user.id,
        email: user.email,
        name: user.name,
        permissions: (user as any).permissionKeys,
        sub: user.id,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json({
      success: true,
      message: "Login API Berhasil",
      token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
    });
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
