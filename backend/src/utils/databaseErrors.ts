export function isUniqueConstraintError(error: unknown): boolean {
  const pendingErrors: unknown[] = [error];
  const visited = new Set<object>();

  while (pendingErrors.length > 0) {
    const current = pendingErrors.pop();

    if (typeof current !== 'object' || current === null || visited.has(current)) {
      continue;
    }

    visited.add(current);
    const errorDetails = current as Record<string, unknown>;

    if (errorDetails.code === '23505') {
      return true;
    }

    for (const key of ['cause', 'originalError', 'driverError']) {
      const nestedError = errorDetails[key];
      if (nestedError !== undefined) {
        pendingErrors.push(nestedError);
      }
    }
  }

  return false;
}
