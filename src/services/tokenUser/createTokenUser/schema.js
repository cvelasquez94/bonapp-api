const schema = {
  tags: ['users'],
  summary: 'createTokenUser',
  description: 'createTokenUser',
  body: {
    type: 'object',
    required: ['userId', 'type'],
    properties: {
      userId: {
        type: 'integer',
      },
      token: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['notification'],
      },
      device: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      description: 'Notification Created',
      type: 'object',
      properties: {
        id: { type: 'number' },
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
