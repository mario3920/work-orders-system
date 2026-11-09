import type { FromSchema } from 'json-schema-to-ts';

export const updateClientSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
        pattern: '^[1-9][0-9]*$',
      },
    },
  },
  body: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      name: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      phone: {
        type: 'string',
        minLength: 1,
        maxLength: 20,
      },
    },
  },
} as const;

export type UpdateClientInput = FromSchema<typeof updateClientSchema.body>;
