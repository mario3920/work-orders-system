import * as employeesRepository from './employeesRepository.js';
import { AppError } from '../../errors/AppError.js';
import type { UpdateEmployeeInput } from './schemas/updateEmployee.schema.js';

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
