import * as employeesRepository from './employeesRepository.js';
import { AppError } from '../../errors/AppError.js';
import type { CreateEmployeeInput } from './schemas/createEmployee.schema.js';
import type { UpdateEmployeeInput } from './schemas/updateEmployee.schema.js';

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === '23505'
  );
}

export async function createEmployee(data: CreateEmployeeInput) {
  const user = await employeesRepository.findUserForEmployeeCreation(
    data.userId,
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }
  if (user.role !== 'EMPLOYEE') {
    throw new AppError('User must have the EMPLOYEE role', 409);
  }
  if (!user.active) {
    throw new AppError('User is inactive', 409);
  }

  try {
    return await employeesRepository.createEmployee({
      ...data,
      hiredAt: new Date(data.hiredAt),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      throw new AppError(
        'An employee already exists for this user or employee code',
        409,
      );
    }

    throw error;
  }
}

export async function getAllEmployees(page: number) {
  return employeesRepository.findAllEmployees(page);
}

export async function getEmployeeById(id: number) {
  const employee = await employeesRepository.findEmployeeById(id);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  return employee;
}

export async function updateEmployee(id: number, data: UpdateEmployeeInput) {
  const employee = await employeesRepository.updateEmployee(id, data);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }

  return employee;
}

export async function deactivateEmployee(id: number) {
  const employee = await employeesRepository.deactivateEmployee(id);

  if (!employee) {
    throw new AppError('Employee not found', 404);
  }
}
