import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";
import { Role } from "@/server/db/entities/Role";

export async function POST(req: NextRequest) {
  try {
    await initializeDB();

    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, Email, dan Password wajib diisi" },
        { status: 400 }
      );
    }

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    const existingUser = await userRepo.findOneBy({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan login." },
        { status: 409 }
      );
    }

    const userRole = await roleRepo.findOneBy({ name: "User" });

    if (!userRole) {
      return NextResponse.json(
        { error: "System Error: Default role 'User' not found." },
        { status: 500 }
      );
    }

    const passwordHash = await hash(password, 10);

    const newUser = userRepo.create({
      name,
      email,
      passwordHash,
      roles: [userRole],
    });

    await userRepo.save(newUser);

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
