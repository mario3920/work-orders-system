export const listServiceOrdersSchema = {
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