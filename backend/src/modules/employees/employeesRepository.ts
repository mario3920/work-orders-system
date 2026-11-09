import { eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { employees, users } from '../../db/schema.js';

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
