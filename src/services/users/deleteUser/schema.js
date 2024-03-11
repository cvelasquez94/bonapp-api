const schema = {
  tags: ['users'],
  summary: 'deleteUser',
  description: 'deleteUser',
  query: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
      },
    },
  },
  response: {
    204: {
       description: 'User deleted',
       type: 'null',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
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
