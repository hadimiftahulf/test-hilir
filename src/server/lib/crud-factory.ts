// src/lib/crud-factory.ts
import { NextRequest, NextResponse } from "next/server";
import {
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  EntityTarget,
  FindOptionsOrder,
} from "typeorm";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { withAuth } from "./api-wrapper";

// Tipe Config untuk Factory
type CrudOptions<T extends ObjectLiteral> = {
  entity: EntityTarget<T>;
  permissions: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
  relations?: string[];

  // HOOKS
  beforeSave?: (
    data: DeepPartial<T>,
    req: NextRequest
  ) => Promise<DeepPartial<T>>;

  transform?: (data: T) => unknown;
};

// ==================================================================
// 1. FACTORY: GET ALL & POST
// ==================================================================
export function createCollectionHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  // HANDLER GET (LIST)
  const GET = async (req: NextRequest) => {
    return withAuth(req, { permission: options.permissions.read }, async () => {
      await initializeDB();
      const repo = AppDataSource.getRepository(options.entity);

      const data = await repo.find({
        relations: options.relations,
        // Double casting untuk bypass error TS2322
        order: { createdAt: "DESC" } as unknown as FindOptionsOrder<T>,
      });

      // Gunakan arrow function eksplisit untuk map
      const sanitizedData = options.transform
        ? data.map((item) => options.transform!(item))
        : data;

      return NextResponse.json({ data: sanitizedData });
    });
  };

  // HANDLER POST (CREATE)
  const POST = async (req: NextRequest) => {
    return withAuth(
      req,
      { permission: options.permissions.create },
      async (_user, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);

        // Casting ke DeepPartial<T> agar sesuai dengan repo.create
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
// 2. FACTORY: GET ONE, PUT, DELETE (Butuh ID)
// ==================================================================
export function createItemHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  type Ctx = { params: { id: string } };

  // HANDLER GET ONE
  const GET = async (req: NextRequest, { params }: Ctx) => {
    return withAuth(req, { permission: options.permissions.read }, async () => {
      await initializeDB();
      const repo = AppDataSource.getRepository(options.entity);

      // FIX ERROR TS2352: Conversion of type '{ id: string; }' to type 'FindOptionsWhere<T>'
      // Kita gunakan 'as unknown' dulu sebagai jembatan.
      const whereCondition = {
        id: params.id,
      } as unknown as FindOptionsWhere<T>;

      const item = await repo.findOne({
        where: whereCondition,
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

        let body = (await apiReq.json()) as DeepPartial<T>;

        // FIX ERROR TS2352: Sama seperti di atas
        const whereCondition = {
          id: params.id,
        } as unknown as FindOptionsWhere<T>;

        const item = await repo.findOneBy(whereCondition);

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

        const result = await repo.delete(params.id);

        if (result.affected === 0) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
      }
    );
  };

  return { GET, PUT, DELETE };
}
