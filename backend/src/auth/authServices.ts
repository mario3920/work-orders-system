import { AppError } from '../errors/AppError.js';
import * as usersRepository from '../modules/users/usersRepository.js';
import type { LoginUser } from './auth.types.js';
import type { LoginRequest } from './schemas/login.schema.js';
import { verifyPassword } from './password.js';

export async function login(data: LoginRequest): Promise<LoginUser> {
  const email = data.email.trim().toLowerCase();
  const user = await usersRepository.findUserForLogin(email);

  if (!user || !(await verifyPassword(data.password, user.passwordHash))) {
    throw new AppError('Invalid email or password', 401);
  }

  if (!user.active) {
    throw new AppError('User is inactive', 403);
  }

  if (user.role === 'CLIENT') {
    if (user.clientId === null) {
      throw new AppError('Client profile not found for user', 500);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      clientId: user.clientId,
    };
  }

  if (user.role === 'EMPLOYEE') {
    if (user.employeeId === null) {
      throw new AppError('Employee profile not found for user', 500);
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    };
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}
