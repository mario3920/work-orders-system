
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { serviceOrders } from '../../db/schema.js';

export async function createServiceOrder(data: typeof serviceOrders.$inferInsert) {
  const [order] = await db
    .insert(serviceOrders)
    .values(data)
    .returning();

  return order;
}

export async function findAllServiceOrders() {
  return db
    .select()
    .from(serviceOrders)
    .orderBy(desc(serviceOrders.createdAt));
}

export async function findServiceOrderById(id: number) {
  const [order] = await db
    .select()
    .from(serviceOrders)
    .where(eq(serviceOrders.id, id))
    .limit(1);

  return order ?? null;
}

export async function updateServiceOrder(
  id: number,
  data: Partial<typeof serviceOrders.$inferInsert>,
) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(serviceOrders.id, id))
    .returning();

  return order ?? null;
}

export async function deleteServiceOrder(id: number) {
  const [order] = await db
    .delete(serviceOrders)
    .where(eq(serviceOrders.id, id))
    .returning();

  return order ?? null;
}

export async function startServiceOrderProcessing(id: number) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      status: 'PROCESSING',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(serviceOrders.id, id),
        eq(serviceOrders.status, 'PENDING'),
      ),
    )
    .returning();

  return order ?? null;
}

export async function cancelServiceOrder(id: number) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      status: 'CANCELED',
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(serviceOrders.id, id),
        eq(serviceOrders.status, 'PENDING'),
      ),
    )
    .returning();

  return order ?? null;
}
