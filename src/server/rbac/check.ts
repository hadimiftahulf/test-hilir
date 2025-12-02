import { PermAction, PermScope } from "../db/entities/Permission";

// src/server/rbac/check.ts
export function can(
  permKeys: string[],
  resource: string,
  action: PermAction,
  scope: PermScope = "any"
) {
  const keyExact = `${resource}:${action}:${scope}`;
  const keyAny = `${resource}:${action}:any`;
  return permKeys.includes(keyExact) || permKeys.includes(keyAny);
}
