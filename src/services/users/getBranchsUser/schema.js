const schema = {
  tags: ['users'],
  summary: 'getBranchsUser',
  description: 'getBranchsUser',
  query: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      description: 'Bad request',
      type: 'array',
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
      },
    },
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
