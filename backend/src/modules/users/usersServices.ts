import * as usersRepository from './usersRepository.js';
import { AppError } from '../../errors/AppError.js';
import type { CreateUserInput } from './schemas/createUser.schema.js';
import type { UpdateUserInput } from './schemas/updateUser.schema.js';
import { hashPassword } from '../../auth/password.js';
import { isUniqueConstraintError } from '../../utils/databaseErrors.js';
import { db } from '../../db/connection.js';
import * as clientsRepository from '../clients/clientsRepository.js';
import * as employeesRepository from '../employees/employeesRepository.js';

function throwEmailConflict(error: unknown): never {
  if (isUniqueConstraintError(error)) {
    throw new AppError('Email is already in use', 409);
  }

  throw error;
}

export async function createUser(data: CreateUserInput) {
  const email = data.email.trim().toLowerCase();
  const existingUser = await usersRepository.findUserByEmail(email);

  if (existingUser) {
    throw new AppError('Email is already in use', 409);
  }

  const passwordHash = await hashPassword(data.password);

  try {
    return await db.transaction(async (tx) => {
      const user = await usersRepository.createUser(tx, {
        email,
        passwordHash,
        role: data.role,
      });

      if (!user) {
        throw new Error('User insert returned no row');
      }

      if (data.role === 'CLIENT') {
        await clientsRepository.createClient(tx, {
          userId: user.id,
          name: data.name,
          phone: data.phone,
        });
      } else if (data.role === 'EMPLOYEE') {
        await employeesRepository.createEmployee(tx, {
          userId: user.id,
          name: data.name,
          phone: data.phone,
          employeeCode: data.employeeCode,
          hiredAt: new Date(data.hiredAt),
        });
      }

      return user;
    });
  } catch (error) {
    if (isUniqueConstraintError(error) && data.role === 'EMPLOYEE') {
      throw new AppError('Email or employee code is already in use', 409);
    }
    throwEmailConflict(error);
  }
}

export async function getAllUsers(page: number) {
  return usersRepository.findAllUsers(page);
}

export async function getUserById(id: number) {
  const user = await usersRepository.findUserById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
}

export async function updateUser(id: number, data: UpdateUserInput) {
  const updateData: {
    email?: string;
    passwordHash?: string;
  } = {};

  if (data.email !== undefined) {
    updateData.email = data.email.trim().toLowerCase();
  }
  if (data.password !== undefined) {
    updateData.passwordHash = await hashPassword(data.password);
  }

  try {
    const user = await usersRepository.updateUser(id, updateData);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  } catch (error) {
    throwEmailConflict(error);
  }
}

export async function deactivateUser(id: number) {
  const user = await usersRepository.deactivateUser(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }
}
