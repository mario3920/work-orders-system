import { count, desc, eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { clients, users } from '../../db/schema.js';
import { buildPagination, getPagination } from '../../utils/pagination.js';
import type { UpdateClientInput } from './schemas/updateClient.schema.js';

export async function findAllClients(page: number) {
  const { limit, offset } = getPagination(page);
  const allClients = await db
    .select()
    .from(clients)
    .orderBy(desc(clients.createdAt), desc(clients.id))
    .limit(limit)
    .offset(offset);

  const [counter] = await db.select({ total: count() }).from(clients);
  const total = counter?.total ?? 0;

  return {
    clients: allClients,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findClientById(id: number) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  return client ?? null;
}

export async function findClientWithUserById(id: number) {
  const [client] = await db
    .select({
      id: clients.id,
      name: clients.name,
      phone: clients.phone,
      user: {
        id: users.id,
        email: users.email,
        active: users.active,
      },
    })
    .from(clients)
    .innerJoin(users, eq(clients.userId, users.id))
    .where(eq(clients.id, id))
    .limit(1);

  return client ?? null;
}

export async function updateClient(id: number, data: UpdateClientInput) {
  const [client] = await db
    .update(clients)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(clients.id, id))
    .returning();

  return client ?? null;
}
