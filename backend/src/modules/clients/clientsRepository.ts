import { eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { clients } from '../../db/schema.js';

export async function findClientById(id: number) {
  const [client] = await db
    .select()
    .from(clients)
    .where(eq(clients.id, id))
    .limit(1);

  return client ?? null;
}