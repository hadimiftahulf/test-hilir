import { hash } from "bcryptjs";
import { User } from "@/server/db/entities/User";
import { createCollectionHandlers } from "@/server/lib/crud-factory";
const handlers = createCollectionHandlers<User>({
  entity: User,
  relations: ["roles"],
  permissions: {
    read: "users:read",
    create: "users:create",
  },
  beforeSave: async (data, req) => {
    if ((data as any).password) {
      data.passwordHash = await hash((data as any).password, 10);
      delete (data as any).password;
    }

    if ((data as any).roleIds) {
      data.roles = (data as any).roleIds.map((id: string) => ({ id }));
    }

    return data;
  },
  transform: (user) => {
    const { passwordHash, ...cleanUser } = user;
    return cleanUser;
  },
});

export const { GET, POST } = handlers;
