import { NextRequest, NextResponse } from "next/server";
import {
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  EntityTarget,
  FindOptionsOrder,
} from "typeorm";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { withAuth } from "./api-wrapper"; // Sesuaikan path import ini jika perlu

type CrudOptions<T extends ObjectLiteral> = {
  entity: EntityTarget<T>;
  permissions: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
  relations?: string[];
  beforeSave?: (
    data: DeepPartial<T>,
    req: NextRequest
  ) => Promise<DeepPartial<T>>;
  transform?: (data: T) => unknown;
};

// ==================================================================
// 1. FACTORY: GET ALL & POST (Tidak butuh params ID)
// ==================================================================
export function createCollectionHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  const GET = async (req: NextRequest) => {
    return withAuth(req, { permission: options.permissions.read }, async () => {
      await initializeDB();
      const repo = AppDataSource.getRepository(options.entity);

      const data = await repo.find({
        relations: options.relations,
        order: { createdAt: "DESC" } as unknown as FindOptionsOrder<T>,
      });

      const sanitizedData = options.transform
        ? data.map((item) => options.transform!(item))
        : data;

      return NextResponse.json({ data: sanitizedData });
    });
  };

  const POST = async (req: NextRequest) => {
    return withAuth(
      req,
      { permission: options.permissions.create },
      async (_user, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        let body = (await apiReq.json()) as DeepPartial<T>;

        if (options.beforeSave) {
          body = await options.beforeSave(body, apiReq);
        }

        const newItem = repo.create(body);
        await repo.save(newItem);

        const responseData = options.transform
          ? options.transform(newItem)
          : newItem;

        return NextResponse.json(
          { message: "Created", data: responseData },
          { status: 201 }
        );
      }
    );
  };

  return { GET, POST };
}

// ==================================================================
// 2. FACTORY: GET ONE, PUT, DELETE (WAJIB AWAIT PARAMS DI SINI)
// ==================================================================
export function createItemHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  // 👇 Definisi tipe untuk Next.js 15/16: params adalah Promise
  type Ctx = { params: Promise<{ id: string }> };

  // HANDLER GET ONE
  const GET = async (req: NextRequest, { params }: Ctx) => {
    return withAuth(req, { permission: options.permissions.read }, async () => {
      await initializeDB();
      const repo = AppDataSource.getRepository(options.entity);

      // 👇 WAJIB AWAIT
      const { id } = await params;

      const item = await repo.findOne({
        where: { id } as unknown as FindOptionsWhere<T>,
        relations: options.relations,
      });

      if (!item)
        return NextResponse.json({ error: "Not found" }, { status: 404 });

      const responseData = options.transform ? options.transform(item) : item;
      return NextResponse.json({ data: responseData });
    });
  };

  // HANDLER PUT (UPDATE)
  const PUT = async (req: NextRequest, { params }: Ctx) => {
    return withAuth(
      req,
      { permission: options.permissions.update },
      async (_user, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);

        // 👇 WAJIB AWAIT
        const { id } = await params;

        let body = (await apiReq.json()) as DeepPartial<T>;

        const item = await repo.findOneBy({
          id,
        } as unknown as FindOptionsWhere<T>);

        if (!item)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (options.beforeSave) {
          body = await options.beforeSave(body, apiReq);
        }

        repo.merge(item, body);
        await repo.save(item);

        const responseData = options.transform ? options.transform(item) : item;
        return NextResponse.json({ message: "Updated", data: responseData });
      }
    );
  };

  // HANDLER DELETE
  const DELETE = async (req: NextRequest, { params }: Ctx) => {
    return withAuth(
      req,
      { permission: options.permissions.delete },
      async () => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);

        // 👇👇👇 PERBAIKAN UTAMA DI SINI 👇👇👇
        // Sebelumnya: repo.delete(params.id) -> Error karena params.id undefined
        // Sekarang: await params dulu, baru ambil id
        const { id } = await params;

        if (!id) {
          return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const result = await repo.delete(id);

        if (result.affected === 0) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
      }
    );
  };

  return { GET, PUT, DELETE };
}
