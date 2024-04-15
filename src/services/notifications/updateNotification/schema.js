const schema = {
  tags: ['notifications'],
  summary: 'updateNotification',
  description: 'updateNotification',
  body: {
    type: 'object',
    required: ['id', 'read'],
    properties: {
      id: {
        type: 'integer',
      },
      read: {
        type: 'integer',
        enum: [0, 1],
      },
    },
  },
  response: {
    204: {
      description: 'User updated',
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
