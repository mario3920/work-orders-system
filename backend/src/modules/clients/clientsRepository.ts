import { eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { clients, users } from '../../db/schema.js';

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
