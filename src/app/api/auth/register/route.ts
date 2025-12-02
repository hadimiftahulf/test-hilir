import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";
import { Role } from "@/server/db/entities/Role";

export async function POST(req: NextRequest) {
  try {
    // 1. Init Database
    await initializeDB();

    // 2. Parse Input
    const body = await req.json();
    const { name, email, password } = body;

    // 3. Validasi Dasar
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, Email, dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    // 4. Cek Email Duplikat
    // Kita gunakan findOneBy agar lebih cepat
    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 } // 409 Conflict
      );
    }

    // 5. Cari Default Role ("User")
    // PENTING: Jangan biarkan user memilih role sendiri via body request (Security risk!)
    // Kita paksa semua yang register lewat jalur ini jadi "User" biasa.
    const userRole = await roleRepo.findOneBy({ name: "User" });

    if (!userRole) {
      return NextResponse.json(
        { error: "System Error: Default role 'User' not found." },
        { status: 500 }
      );
    }

    // 6. Hash Password
    const passwordHash = await hash(password, 10);

    // 7. Simpan User Baru
    const newUser = userRepo.create({
      name,
      email,
      passwordHash,
      roles: [userRole], // Assign default role
    });

    await userRepo.save(newUser);

    // 8. Return Success (Tanpa data sensitif)
    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server" },
      { status: 500 }
    );
  }
}
