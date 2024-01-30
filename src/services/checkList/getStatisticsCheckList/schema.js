const schema = {
  tags: ['CheckList'],
  summary: 'getChecklist',
  description: 'check list',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'string',
      },
      userId: {
        type: 'integer',
      },
      dateNow: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      description: 'Get check list',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          desc: { type: 'string' },
        },
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
    401: {
      description: 'Invalid username or password',
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
