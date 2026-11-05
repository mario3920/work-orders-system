import * as employeesRepository from './employeesRepository.js';

export async function getEmployeeById(id: number) {
  const employee = await employeesRepository.findEmployeeById(id);

  if (!employee) {
    throw new Error('Employee not found');
  }

  return employee;
}
