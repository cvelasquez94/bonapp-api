const schema = {
  tags: ['Files'],
  summary: 'getCategories',
  description: 'getCategories',
  query: {
    type: 'object',
    properties: {
      branch_id: {
        type: 'integer',
      },
      type: {
        type: 'string',
      },
      subtype: {
        type: 'string',
      },
    },
  },
  response: {
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    403: {
      description: 'Forbidden',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    404: {
      description: 'Could not provision',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
    500: {
      description: 'Generic server error',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' },
      },
    },
  },
};

module.exports = schema;
