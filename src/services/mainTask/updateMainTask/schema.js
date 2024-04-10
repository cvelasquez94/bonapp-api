const schema = {
  tags: ['MainTask'],
  summary: 'updateMainTask',
  description: 'updateMainTask',
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      name: { type: 'string' },
      desc: { type: 'string' },
      enable: { type: 'integer' },
      orden: { type: 'integer' },
      schedule_start: { 
        type: 'string',
        format: 'date-time', },
      schedule_end: { 
        type: 'string',
        format: 'date-time', },
    },
  },
  response: {
    200: {
      description: 'MainTask updated',
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
