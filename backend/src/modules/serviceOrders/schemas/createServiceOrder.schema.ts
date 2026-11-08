import type { FromSchema } from 'json-schema-to-ts';

export const createServiceOrderSchema = {
  body: {
    type: 'object',
    required: ['clientId', 'description'],
    additionalProperties: false,
    properties: {
      clientId: {
        type: 'integer',
        minimum: 1,
      },
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

export type CreateServiceOrderInput = FromSchema<
  typeof createServiceOrderSchema.body
>;
