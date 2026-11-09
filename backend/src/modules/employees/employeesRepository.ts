import { count, desc, eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { employees, users } from '../../db/schema.js';
import { buildPagination, getPagination } from '../../utils/pagination.js';
import type { UpdateEmployeeInput } from './schemas/updateEmployee.schema.js';

export async function findAllEmployees(page: number) {
  const { limit, offset } = getPagination(page);
  const allEmployees = await db
    .select()
    .from(employees)
    .orderBy(desc(employees.createdAt), desc(employees.id))
    .limit(limit)
    .offset(offset);

  const [counter] = await db.select({ total: count() }).from(employees);
  const total = counter?.total ?? 0;

  return {
    employees: allEmployees,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findEmployeeById(id: number) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, id))
    .limit(1);

  return employee ?? null;
}

export async function findEmployeeWithUserById(id: number) {
  const [employee] = await db
    .select({
      id: employees.id,
      name: employees.name,
      phone: employees.phone,
      employeeCode: employees.employeeCode,
      employmentStatus: employees.employmentStatus,
      hiredAt: employees.hiredAt,
      terminatedAt: employees.terminatedAt,
      user: {
        id: users.id,
        email: users.email,
        active: users.active,
      },
    })
    .from(employees)
    .innerJoin(users, eq(employees.userId, users.id))
    .where(eq(employees.id, id))
    .limit(1);

  return employee ?? null;
}

export async function findUserForEmployeeCreation(userId: number) {
  const [user] = await db
    .select({
      id: users.id,
      role: users.role,
      active: users.active,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function createEmployee(data: typeof employees.$inferInsert) {
  const [employee] = await db.insert(employees).values(data).returning();

  return employee;
}

export async function updateEmployee(id: number, data: UpdateEmployeeInput) {
  const [employee] = await db
    .update(employees)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(employees.id, id))
    .returning();

  return employee ?? null;
}

export async function deactivateEmployee(id: number) {
  return db.transaction(async (tx) => {
    const now = new Date();
    const [employee] = await tx
      .update(employees)
      .set({
        employmentStatus: 'INACTIVE',
        terminatedAt: now,
        updatedAt: now,
      })
      .where(eq(employees.id, id))
      .returning();

    if (!employee) {
      return null;
    }

    await tx
      .update(users)
      .set({
        active: false,
        updatedAt: now,
      })
      .where(eq(users.id, employee.userId));

    return employee;
  });
}
