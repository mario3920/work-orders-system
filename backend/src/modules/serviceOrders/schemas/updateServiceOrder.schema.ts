import type { FromSchema } from 'json-schema-to-ts';

export const updateServiceOrderSchema = {
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string' },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 2000,
      },
      priority: {
        type: 'string',
        enum: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
      },
      responsibleId: {
        anyOf: [
          {
            type: 'integer',
            minimum: 1,
          },
          {
            type: 'null',
          },
        ],
      },
    },
  },
} as const;

export type UpdateServiceOrderInput = FromSchema<
  typeof updateServiceOrderSchema.body
>;
