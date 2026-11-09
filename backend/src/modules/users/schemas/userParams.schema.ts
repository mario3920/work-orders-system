export const userParamsSchema = {
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
} as const;

export const usersPaginationSchema = {
  querystring: {
    type: 'object',
    additionalProperties: false,
    properties: {
      page: {
        type: 'integer',
        minimum: 1,
        default: 1,
      },
    },
  },
} as const;
