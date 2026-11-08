export const serviceOrderParamsSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: { type: 'string', pattern: '^[1-9][0-9]*$' },
    },
  },
} as const;
