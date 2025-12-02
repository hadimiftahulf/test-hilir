import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserPermissions } from "../services/permission.service";

// Tipe User yang sekarang punya Permissions
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: { name: string }[];
  permissions: string[]; // List key, misal ["users:read:any"]
};

type ApiOptions = {
  // Sekarang kita cek permission, bukan role lagi
  permission?: string;
};

type ApiLogic = (user: AuthUser, req: NextRequest) => Promise<NextResponse>;

export async function withAuth(
  req: NextRequest,
  options: ApiOptions | null,
  logic: ApiLogic
) {
  try {
    // 1. AMBIL TOKEN
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login" },
        { status: 401 }
      );
    }
    const permissions = await getUserPermissions(token.uid as string);

    // 2. CONSTRUCT USER OBJECT
    const user: AuthUser = {
      id: token.uid as string,
      email: token.email as string,
      name: token.name as string,
      roles: (token.roles as any[]) || [],
      // Ambil array permission dari token
      permissions: permissions,
    };

    // 3. PERMISSION CHECK (RBAC Level Database)
    if (options?.permission) {
      // Cek apakah user punya permission key yang diminta
      const hasPermission = user.permissions.includes(options.permission);

      if (!hasPermission) {
        console.warn(
          `User ${user.email} blocked. Missing: ${options.permission}`
        );
        return NextResponse.json(
          {
            error: "Forbidden",
            message: `Anda tidak memiliki izin: ${options.permission}`,
          },
          { status: 403 }
        );
      }
    }

    // 4. JALANKAN LOGIC
    return await logic(user, req);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
