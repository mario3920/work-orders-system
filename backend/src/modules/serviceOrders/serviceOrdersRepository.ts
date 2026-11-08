import { and, desc, eq, isNull, count } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { serviceOrders } from '../../db/schema.js';
import type {
  UpdateServiceOrderData,
  ServiceOrderFinalStatus,
} from './serviceOrders.types.js';
import { buildPagination, getPagination } from '../../utils/pagination.js';

export async function createServiceOrder(
  data: typeof serviceOrders.$inferInsert,
) {
  const [order] = await db.insert(serviceOrders).values(data).returning();

  return order;
}

export async function findAllServiceOrders(page: number) {
  const { limit, offset } = getPagination(page);
  const orders = await db
    .select()
    .from(serviceOrders)
    .where(isNull(serviceOrders.deletedAt))
    .orderBy(desc(serviceOrders.createdAt))
    .limit(limit)
    .offset(offset);

  const paginationCounter = await db
    .select({ total: count() })
    .from(serviceOrders)
    .where(isNull(serviceOrders.deletedAt));

  const total = paginationCounter[0]?.total ?? 0;

  return {
    orders: orders ?? null,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findAllServiceOrdersByClient(id: number, page: number) {
  const { limit, offset } = getPagination(page);
  const orders = await db
    .select()
    .from(serviceOrders)
    .where(and(eq(serviceOrders.clientId, id), isNull(serviceOrders.deletedAt)))
    .orderBy(desc(serviceOrders.createdAt))
    .limit(limit)
    .offset(offset);

  const paginationCounter = await db
    .select({ total: count() })
    .from(serviceOrders)
    .where(
      and(eq(serviceOrders.clientId, id), isNull(serviceOrders.deletedAt)),
    );

  const total = paginationCounter[0]?.total ?? 0;

  return {
    orders: orders ?? null,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findServiceOrderById(id: number) {
  const [order] = await db
    .select()
    .from(serviceOrders)
    .where(and(eq(serviceOrders.id, id), isNull(serviceOrders.deletedAt)))
    .limit(1);

  return order ?? null;
}

export async function updateServiceOrder(
  id: number,
  data: UpdateServiceOrderData,
) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(serviceOrders.id, id),
        eq(serviceOrders.status, 'PENDING'),
        isNull(serviceOrders.deletedAt),
      ),
    )
    .returning();

  return order ?? null;
}

export async function updateServiceOrderStatus(
  id: number,
  status: ServiceOrderFinalStatus,
) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      status,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(serviceOrders.id, id),
        eq(serviceOrders.status, 'PROCESSING'),
        isNull(serviceOrders.deletedAt),
      ),
    )
    .returning();

  return order ?? null;
}

export async function deleteServiceOrder(id: number) {
  const [order] = await db
    .update(serviceOrders)
    .set({
      deletedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(serviceOrders.id, id),
        eq(serviceOrders.status, 'PENDING'),
        isNull(serviceOrders.deletedAt),
      ),
    )
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
        isNull(serviceOrders.deletedAt),
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
        isNull(serviceOrders.deletedAt),
      ),
    )
    .returning();

  return order ?? null;
}
