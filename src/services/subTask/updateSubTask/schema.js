const schema = {
  tags: ['SubTask'],
  summary: 'updateSubTask',
  description: 'updateSubTask',
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      name: { type: 'string' },
      desc: { type: 'string' },
      expiration: { type: 'string', format: 'date-time', },
      //mainTask_id: { type: 'integer' },
      scoreMultiplier: { type: 'integer' },
      orden: { type: 'integer' },
      enable: { type: 'integer' },
    },
  },
  response: {
    200: {
      description: 'SubTask updated',
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
