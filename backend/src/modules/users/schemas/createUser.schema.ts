import type { FromSchema } from 'json-schema-to-ts';

export const createUserSchema = {
  body: {
    oneOf: [
      {
        type: 'object',
        required: ['email', 'password', 'role', 'name', 'phone'],
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email', minLength: 3, maxLength: 255 },
          password: { type: 'string', minLength: 8, maxLength: 128 },
          role: { const: 'CLIENT' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          phone: { type: 'string', minLength: 1, maxLength: 20 },
        },
      },
      {
        type: 'object',
        required: [
          'email',
          'password',
          'role',
          'name',
          'phone',
          'employeeCode',
          'hiredAt',
        ],
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email', minLength: 3, maxLength: 255 },
          password: { type: 'string', minLength: 8, maxLength: 128 },
          role: { const: 'EMPLOYEE' },
          name: { type: 'string', minLength: 1, maxLength: 255 },
          phone: { type: 'string', minLength: 1, maxLength: 20 },
          employeeCode: { type: 'string', minLength: 1, maxLength: 50 },
          hiredAt: { type: 'string', format: 'date-time' },
        },
      },
      {
        type: 'object',
        required: ['email', 'password', 'role'],
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email', minLength: 3, maxLength: 255 },
          password: { type: 'string', minLength: 8, maxLength: 128 },
          role: { const: 'ADMIN' },
        },
      },
    ],
  },
} as const;

export type CreateUserInput = FromSchema<typeof createUserSchema.body>;
