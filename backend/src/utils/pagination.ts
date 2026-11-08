const defaultLimit = 20;

export function getPagination(page: number) {
  const limit = defaultLimit;
  const offset = (page - 1) * limit;

  return { limit, offset };
}

export function buildPagination(total: number, page: number, limit: number) {
  return {
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    limit,
  };
}
