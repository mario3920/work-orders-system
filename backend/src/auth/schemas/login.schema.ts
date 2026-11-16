import type { FromSchema } from 'json-schema-to-ts';

export const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
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
        minLength: 1,
        maxLength: 128,
      },
    },
  },
} as const;

export type LoginRequest = FromSchema<typeof loginSchema.body>;
