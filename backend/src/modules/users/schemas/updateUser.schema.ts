import type { FromSchema } from 'json-schema-to-ts';

export const updateUserSchema = {
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
      email: {
        type: 'string',
        format: 'email',
        minLength: 3,
        maxLength: 255,
      },
      password: {
        type: 'string',
        minLength: 8,
        maxLength: 128,
      },
    },
  },
} as const;

export type UpdateUserInput = FromSchema<typeof updateUserSchema.body>;
