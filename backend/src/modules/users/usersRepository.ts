import { count, desc, eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { users } from '../../db/schema.js';
import { buildPagination, getPagination } from '../../utils/pagination.js';

const publicUserFields = {
  id: users.id,
  email: users.email,
  role: users.role,
  active: users.active,
  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
};

export async function findAllUsers(page: number) {
  const { limit, offset } = getPagination(page);
  const allUsers = await db
    .select(publicUserFields)
    .from(users)
    .orderBy(desc(users.createdAt), desc(users.id))
    .limit(limit)
    .offset(offset);

  const [counter] = await db.select({ total: count() }).from(users);
  const total = counter?.total ?? 0;

  return {
    users: allUsers,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findUserById(id: number) {
  const [user] = await db
    .select(publicUserFields)
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user ?? null;
}

export async function findUserByEmail(email: string) {
  const [user] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return user ?? null;
}

export async function createUser(
  data: Pick<typeof users.$inferInsert, 'email' | 'passwordHash' | 'role'>,
) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning(publicUserFields);

  return user;
}

export async function updateUser(
  id: number,
  data: Partial<Pick<typeof users.$inferInsert, 'email' | 'passwordHash'>>,
) {
  const [user] = await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning(publicUserFields);

  return user ?? null;
}

export async function deactivateUser(id: number) {
  const [user] = await db
    .update(users)
    .set({
      active: false,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning(publicUserFields);

  return user ?? null;
}
