import { and, desc, eq, isNull, count } from 'drizzle-orm';
import { db } from '../../db/connection.js';
import { serviceOrders } from '../../db/schema.js';
import type { ServiceOrderListQuery } from './schemas/serviceOrderParams.schema.js';
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

function getServiceOrderSortColumn(orderBy: ServiceOrderListQuery['orderBy']) {
  switch (orderBy) {
    case 'updatedAt':
      return serviceOrders.updatedAt;
    case 'priority':
      return serviceOrders.priority;
    case 'status':
      return serviceOrders.status;
    case 'createdAt':
    default:
      return serviceOrders.createdAt;
  }
}

async function findServiceOrders(
  filters: ServiceOrderListQuery,
  clientId?: number,
) {
  const page = filters.page ?? 1;
  const { limit, offset } = getPagination(page);
  const whereConditions = and(
    isNull(serviceOrders.deletedAt),
    clientId !== undefined ? eq(serviceOrders.clientId, clientId) : undefined,
    filters.status ? eq(serviceOrders.status, filters.status) : undefined,
    filters.priority ? eq(serviceOrders.priority, filters.priority) : undefined,
  );
  const sortColumn = getServiceOrderSortColumn(filters.orderBy);

  const orders = await db
    .select()
    .from(serviceOrders)
    .where(whereConditions)
    .orderBy(desc(sortColumn))
    .limit(limit)
    .offset(offset);

  const [paginationCounter] = await db
    .select({ total: count() })
    .from(serviceOrders)
    .where(whereConditions);

  const total = paginationCounter?.total ?? 0;

  return {
    orders,
    pagination: buildPagination(total, page, limit),
  };
}

export async function findAllServiceOrders(filters: ServiceOrderListQuery) {
  return findServiceOrders(filters);
}

export async function findAllServiceOrdersByClient(
  id: number,
  filters: ServiceOrderListQuery,
) {
  return findServiceOrders(filters, id);
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
