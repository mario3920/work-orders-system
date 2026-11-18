import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/AppError.js';
import type { AuthTokenPayload } from './auth.types.js';

export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply,
) {
  try {
    await request.jwtVerify();
  } catch {
    throw new AppError('Authentication required', 401);
  }
}

export function authorizeRoles(...allowedRoles: AuthTokenPayload['role'][]) {
  return async function (request: FastifyRequest, _reply: FastifyReply) {
    if (!allowedRoles.includes(request.user.role)) {
      throw new AppError('Insufficient permissions', 403);
    }
  };
}

export function assertClientAccess(request: FastifyRequest, clientId: number) {
  if (request.user.role === 'CLIENT' && request.user.clientId !== clientId) {
    throw new AppError('Insufficient permissions', 403);
  }
}

export function assertUserAccess(request: FastifyRequest, userId: number) {
  if (request.user.role !== 'ADMIN' && Number(request.user.sub) !== userId) {
    throw new AppError('Insufficient permissions', 403);
  }
}

export function assertEmployeeAccess(
  request: FastifyRequest,
  employeeId: number,
) {
  if (
    request.user.role === 'EMPLOYEE' &&
    request.user.employeeId !== employeeId
  ) {
    throw new AppError('Insufficient permissions', 403);
  }
}
