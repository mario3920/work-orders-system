import { eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { employees } from '../../db/schema.js';

export async function findEmployeeById(id: number) {
  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.id, id))
    .limit(1);

  return employee ?? null;
}