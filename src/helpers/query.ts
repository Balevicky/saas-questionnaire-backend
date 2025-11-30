// src/helpers/query.ts
export function buildPagination(query: any) {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export function buildSearchFilter(search?: string) {
  if (!search) return {};
  return {
    contains: search,
    mode: "insensitive",
  };
}
