import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserPermissions } from "../services/permission.service"; // Asumsi path service ini benar

// --- NEW TYPES ---
export type AccessScope = "any" | "own";

// Tipe User yang akan diteruskan ke Factory/Route Handler
export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: { name: string }[];
  permissions: string[];
};

// Tipe untuk input options pada withAuth (menerima BASE permission, e.g., 'users:read')
type ApiOptions = {
  basePermission: string | undefined; // Wajib: Base permission key tanpa :scope
};

// Tipe fungsi logic yang menerima user dan scope yang sudah ditentukan
type ApiLogic = (
  user: AuthUser,
  scope: AccessScope,
  req: NextRequest
) => Promise<NextResponse>;

export async function withAuth(
  req: NextRequest,
  // Kita harus memastikan options tidak null, tapi Next.js Route Handlers
  // biasanya tidak mengirim null, jadi kita tangani di dalam.
  options: ApiOptions | null,
  logic: ApiLogic
) {
  try {
    // 1. AMBIL TOKEN & PERMISSION DARI DB
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login" },
        { status: 401 }
      );
    }

    // Ambil permission secara on-demand (sudah difix di previous turn agar token kecil)
    const permissions = await getUserPermissions(token.uid as string);
    const userPermissions = permissions || [];

    // 2. CONSTRUCT USER OBJECT
    const user: AuthUser = {
      id: token.uid as string,
      email: token.email as string,
      name: token.name as string,
      roles: (token.roles as any[]) || [],
      permissions: userPermissions,
    };

    // 3. RBAC CHECK (Scoping Logic)
    const requiredBasePerm = options?.basePermission;
    let effectiveScope: AccessScope = "any"; // Default jika tidak ada permission yang diminta

    if (requiredBasePerm) {
      const permAny = requiredBasePerm + ":any";
      const permOwn = requiredBasePerm + ":own";

      const hasAny = userPermissions.includes(permAny);
      const hasOwn = userPermissions.includes(permOwn);

      // Tentukan Scope Efektif: ANY (Paling Tinggi) wins over OWN
      if (hasAny) {
        effectiveScope = "any";
      } else if (hasOwn) {
        effectiveScope = "own";
      } else {
        // Jika tidak punya izin sama sekali
        return NextResponse.json(
          {
            error: "Forbidden",
            message: `Anda tidak memiliki izin untuk operasi: ${requiredBasePerm}`,
          },
          { status: 403 }
        );
      }
    }

    // 4. JALANKAN LOGIC, KIRIM SCOPE
    return await logic(user, effectiveScope, req);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
