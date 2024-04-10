const schema = {
  tags: ['CheckList'],
  summary: 'getCheckListDue',
  description: 'getCheckListDue',
  query: {
    type: 'object',
    properties: {
      interval: {
        type: 'integer',
      },
      time: {
        type: 'string',
        description: 'HH:MM',
      },
    },
  },
  response: {
    200: {
      description: 'Get check list due',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          user_id: { type: 'integer' },
          token: { type: 'string' },
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
