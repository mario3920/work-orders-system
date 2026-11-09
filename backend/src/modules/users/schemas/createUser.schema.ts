import type { FromSchema } from 'json-schema-to-ts';

export const createUserSchema = {
  body: {
    type: 'object',
    required: ['email', 'password', 'role'],
    additionalProperties: false,
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
      role: {
        type: 'string',
        enum: ['EMPLOYEE', 'CLIENT', 'ADMIN'],
      },
    },
  },
} as const;

export type CreateUserInput = FromSchema<typeof createUserSchema.body>;
