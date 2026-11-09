import type { FromSchema } from 'json-schema-to-ts';

export const createEmployeeSchema = {
  body: {
    type: 'object',
    required: ['userId', 'name', 'phone', 'employeeCode', 'hiredAt'],
    additionalProperties: false,
    properties: {
      userId: {
        type: 'integer',
        minimum: 1,
      },
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
      employeeCode: {
        type: 'string',
        minLength: 1,
        maxLength: 50,
      },
      hiredAt: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
} as const;

export type CreateEmployeeInput = FromSchema<typeof createEmployeeSchema.body>;
