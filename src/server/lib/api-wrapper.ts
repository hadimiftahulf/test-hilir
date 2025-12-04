import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserPermissions } from "../services/permission.service";

export type AccessScope = "any" | "own";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  roles: { name: string }[];
  permissions: string[];
};

type ApiOptions = {
  basePermission: string | undefined;
};

type ApiLogic = (
  user: AuthUser,
  scope: AccessScope,
  req: NextRequest
) => Promise<NextResponse>;

export async function withAuth(
  req: NextRequest,

  options: ApiOptions | null,
  logic: ApiLogic
) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: Silakan login" },
        { status: 401 }
      );
    }

    const permissions = await getUserPermissions(token.uid as string);
    const userPermissions = permissions || [];

    const user: AuthUser = {
      id: token.uid as string,
      email: token.email as string,
      name: token.name as string,
      roles: (token.roles as any[]) || [],
      permissions: userPermissions,
    };

    const requiredBasePerm = options?.basePermission;
    let effectiveScope: AccessScope = "any";

    if (requiredBasePerm) {
      const permAny = requiredBasePerm + ":any";
      const permOwn = requiredBasePerm + ":own";

      const hasAny = userPermissions.includes(permAny);
      const hasOwn = userPermissions.includes(permOwn);

      if (hasAny) {
        effectiveScope = "any";
      } else if (hasOwn) {
        effectiveScope = "own";
      } else {
        return NextResponse.json(
          {
            error: "Forbidden",
            message: `Anda tidak memiliki izin untuk operasi: ${requiredBasePerm}`,
          },
          { status: 403 }
        );
      }
    }

    return await logic(user, effectiveScope, req);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
