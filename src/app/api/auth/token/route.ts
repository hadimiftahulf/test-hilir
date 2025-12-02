import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt"; // Pastikan path ini sesuai lokasi service Anda
import { verifyUserLogin } from "@/server/services/auth.service";

export async function POST(req: Request) {
  try {
    // 1. Ambil input dari Body (Raw JSON)
    const body = await req.json();
    const { email, password } = body;

    // 2. Validasi input dasar
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email dan Password wajib diisi" },
        { status: 400 }
      );
    }

    // 3. Panggil Service Login (Logic Pusat)
    // Ini memanggil fungsi yang sama dengan login Web, jadi logic-nya konsisten.
    const user = await verifyUserLogin(email, password);

    // 4. Jika login gagal
    if (!user) {
      return NextResponse.json(
        { error: "Email atau Password salah" },
        { status: 401 }
      );
    }

    // 5. Generate Token Manual
    // Kita gunakan fungsi 'encode' bawaan NextAuth dan SECRET yang sama.
    // Hasilnya adalah token yang valid dan dikenali oleh 'getToken()' / 'api-wrapper'.
    const token = await encode({
      token: {
        uid: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        permissions: (user as any).permissionKeys, // Masukkan permission juga
        sub: user.id, // Subject ID (Standar JWT)
      },
      secret: process.env.NEXTAUTH_SECRET!, // Wajib ada di .env
    });

    // 6. Return Response ke Postman
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
