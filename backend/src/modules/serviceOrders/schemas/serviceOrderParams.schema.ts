import type { FromSchema } from 'json-schema-to-ts';

const serviceOrderIdParams = {
  type: 'object',
  required: ['id'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      pattern: '^[1-9][0-9]*$',
    },
  },
} as const;

const serviceOrderListQuery = {
  type: 'object',
  additionalProperties: false,
  properties: {
    page: {
      type: 'integer',
      minimum: 1,
      default: 1,
    },
    status: {
      type: 'string',
      enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED'],
    },
    priority: {
      type: 'string',
      enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
    },
    orderBy: {
      type: 'string',
      enum: ['createdAt', 'updatedAt', 'priority', 'status'],
      default: 'createdAt',
    },
  },
} as const;

export type ServiceOrderListQuery = FromSchema<typeof serviceOrderListQuery>;

export const serviceOrderParamsSchema = {
  params: serviceOrderIdParams,
} as const;

export const serviceOrderParamsPaginationSchema = {
  params: serviceOrderIdParams,
  querystring: serviceOrderListQuery,
} as const;

export const serviceOrderPaginationSchema = {
  querystring: serviceOrderListQuery,
} as const;

