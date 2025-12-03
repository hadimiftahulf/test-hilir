import { NextRequest, NextResponse } from "next/server";
import {
  ObjectLiteral,
  DeepPartial,
  FindOptionsWhere,
  EntityTarget,
  FindOptionsOrder,
} from "typeorm";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { withAuth, AuthUser, AccessScope } from "./api-wrapper";

// ==================================================================
// 1. CRUD AUXILIARY TYPES (UPDATED)
// ==================================================================
type CrudOptions<T extends ObjectLiteral> = {
  entity: EntityTarget<T>;
  permissions: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
  relations?: string[];
  // 👇 scopeField sekarang bersifat opsional dan hanya diisi jika entity memiliki relasi
  scopeField?: string;
  beforeSave?: (
    data: DeepPartial<T>,
    req: NextRequest
  ) => Promise<DeepPartial<T>>;
  transform?: (data: T) => unknown;
};

// ==================================================================
// 2. FACTORY: GET ALL & POST
// ==================================================================
export function createCollectionHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  // HANDLER GET (LIST)
  const GET = async (req: NextRequest) => {
    const requiredBasePerm = options.permissions.read;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, _apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        let whereCriteria: FindOptionsWhere<T> = {};

        // 👇 CORE SECURITY INJECTION LOGIC
        if (effectiveScope === "own") {
          if (options.scopeField) {
            // KASUS 1: Relational Owned (Misal: Calculation, scopeField='user')
            whereCriteria = {
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            // KASUS 2: Self-Owned (Misal: User Entity itu sendiri)
            // Filter langsung ke Primary Key 'id'
            whereCriteria = {
              id: user.id,
            } as unknown as FindOptionsWhere<T>;
          }
        }
        // Catatan: Jika scope = 'any', whereCriteria tetap kosong {}

        const data = await repo.find({
          where: whereCriteria, // 🎯 TERAPKAN FILTER SCOPE DI SINI
          relations: options.relations,
          order: { createdAt: "DESC" } as unknown as FindOptionsOrder<T>,
        });

        const sanitizedData = options.transform
          ? data.map((item) => options.transform!(item))
          : data;

        return NextResponse.json({ data: sanitizedData });
      }
    );
  };

  // HANDLER POST (CREATE)
  const POST = async (req: NextRequest) => {
    const requiredBasePerm = options.permissions.create;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const entityName = repo.metadata.name; // 👈 Ambil nama entity dari metadata
        let body = (await apiReq.json()) as DeepPartial<T>;

        // Set ownership saat CREATE (hanya jika ada scopeField)
        if (options.scopeField) {
          (body as any)[options.scopeField] = { id: user.id };
        } else if (entityName === "User") {
          // Opsional: Untuk User, ID diset oleh DB, jadi abaikan
        }

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
// 3. FACTORY: GET ONE, PUT, DELETE
// ==================================================================
export function createItemHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  type Ctx = { params: Promise<{ id: string }> };

  // HANDLER GET ONE
  const GET = async (req: NextRequest, { params }: Ctx) => {
    const requiredBasePerm = options.permissions.read;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, _apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const { id } = await params;
        let whereCriteria = { id } as unknown as FindOptionsWhere<T>;

        // Tambahkan filter OWN
        if (effectiveScope === "own") {
          if (options.scopeField) {
            // KASUS 1: Relational Owned (Calculation)
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            // KASUS 2: Self-Owned (User Entity) - Pastikan ID cocok
            whereCriteria = {
              id: user.id, // ID harus sama dengan ID user
            } as unknown as FindOptionsWhere<T>;
          }
        }

        const item = await repo.findOne({
          where: whereCriteria,
          relations: options.relations,
        });

        if (!item)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        const responseData = options.transform ? options.transform(item) : item;
        return NextResponse.json({ data: responseData });
      }
    );
  };

  // HANDLER PUT (UPDATE) - Logic update sama dengan GET (pencarian item)
  const PUT = async (req: NextRequest, { params }: Ctx) => {
    const requiredBasePerm = options.permissions.update;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const entityName = repo.metadata.name; // 👈 Ambil nama entity dari metadata
        const { id } = await params;

        let whereCriteria = { id } as unknown as FindOptionsWhere<T>;

        // Filter untuk memastikan user hanya bisa update data miliknya jika scope = OWN
        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            whereCriteria = { id: user.id } as unknown as FindOptionsWhere<T>; // Update diri sendiri
          }
        }

        const item = await repo.findOneBy(whereCriteria);
        if (!item)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        let body = (await apiReq.json()) as DeepPartial<T>;

        // Pastikan User ID tidak diubah saat update (jika ada scopeField)
        if (options.scopeField) {
          (body as any)[options.scopeField] = { id: user.id };
        } else if (entityName === "User") {
          // Jika entitas User, pastikan payload tidak mengubah ID
          (body as any).id = user.id;
        }

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

  // HANDLER DELETE - Logic delete sama dengan GET (pencarian item)
  const DELETE = async (req: NextRequest, { params }: Ctx) => {
    const requiredBasePerm = options.permissions.delete;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, _apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const { id } = await params;

        let whereCriteria = { id } as unknown as FindOptionsWhere<T>;

        // Filter untuk memastikan user hanya bisa delete data miliknya jika scope = OWN
        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            // Untuk User Entity, filter berdasarkan ID user yang login
            whereCriteria = { id: user.id } as unknown as FindOptionsWhere<T>;
          }
        }

        // Catatan: TypeORM repo.delete(id) bisa menerima ID atau FindOptions
        const deleteResult = await repo.delete(whereCriteria);

        if (deleteResult.affected === 0) {
          return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Deleted successfully" });
      }
    );
  };

  return { GET, PUT, DELETE };
}
