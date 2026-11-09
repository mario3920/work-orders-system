import { randomBytes, scrypt } from 'node:crypto';
import * as usersRepository from './usersRepository.js';
import { AppError } from '../../errors/AppError.js';
import { isUniqueConstraintError } from '../../utils/databaseErrors.js';
import type { CreateUserInput } from './schemas/createUser.schema.js';
import type { UpdateUserInput } from './schemas/updateUser.schema.js';

function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(`scrypt$${salt}$${derivedKey.toString('hex')}`);
    });
  });
}

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
    return await usersRepository.createUser({
      email,
      passwordHash,
      role: data.role,
    });
  } catch (error) {
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
