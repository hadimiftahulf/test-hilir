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

type CrudOptions<T extends ObjectLiteral> = {
  entity: EntityTarget<T>;
  permissions: {
    read?: string;
    create?: string;
    update?: string;
    delete?: string;
  };
  relations?: string[];

  scopeField?: string;
  beforeSave?: (
    data: DeepPartial<T>,
    req: NextRequest
  ) => Promise<DeepPartial<T>>;
  transform?: (data: T) => unknown;
};

export function createCollectionHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  const GET = async (req: NextRequest) => {
    const requiredBasePerm = options.permissions.read;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, _apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        let whereCriteria: FindOptionsWhere<T> = {};

        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            whereCriteria = {
              id: user.id,
            } as unknown as FindOptionsWhere<T>;
          }
        }

        const data = await repo.find({
          where: whereCriteria,
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

  const POST = async (req: NextRequest) => {
    const requiredBasePerm = options.permissions.create;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const entityName = repo.metadata.name;
        let body = (await apiReq.json()) as DeepPartial<T>;

        if (options.scopeField) {
          (body as any)[options.scopeField] = { id: user.id };
        } else if (entityName === "User") {
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

export function createItemHandlers<T extends ObjectLiteral>(
  options: CrudOptions<T>
) {
  type Ctx = { params: Promise<{ id: string }> };

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

        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            whereCriteria = {
              id: user.id,
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

  const PUT = async (req: NextRequest, { params }: Ctx) => {
    const requiredBasePerm = options.permissions.update;

    return withAuth(
      req,
      { basePermission: requiredBasePerm },
      async (user, effectiveScope, apiReq) => {
        await initializeDB();
        const repo = AppDataSource.getRepository(options.entity);
        const entityName = repo.metadata.name;
        const { id } = await params;

        let whereCriteria = { id } as unknown as FindOptionsWhere<T>;

        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            whereCriteria = { id: user.id } as unknown as FindOptionsWhere<T>;
          }
        }

        const item = await repo.findOneBy(whereCriteria);
        if (!item)
          return NextResponse.json({ error: "Not found" }, { status: 404 });

        let body = (await apiReq.json()) as DeepPartial<T>;

        if (options.scopeField) {
          (body as any)[options.scopeField] = { id: user.id };
        } else if (entityName === "User") {
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

        if (effectiveScope === "own") {
          if (options.scopeField) {
            whereCriteria = {
              id,
              [options.scopeField]: { id: user.id },
            } as unknown as FindOptionsWhere<T>;
          } else {
            whereCriteria = { id: user.id } as unknown as FindOptionsWhere<T>;
          }
        }

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
