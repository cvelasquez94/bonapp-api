const schema = {
  tags: ['Restaurant'],
  summary: 'deleteRestaurant',
  description: 'deleteRestaurant',
  query: {
    type: 'object',
    required: ['id'],
    properties: {
      id: {
        type: 'integer',
      },
    },
  },
  response: {
    204: {
       description: 'Restaurant deleted',
       type: 'array',
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
