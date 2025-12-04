export const permKey = (
  r: string,
  a: "read" | "create" | "update" | "delete" | "manage",
  s: "any" | "own"
) => `${r}:${a}:${s}`;
