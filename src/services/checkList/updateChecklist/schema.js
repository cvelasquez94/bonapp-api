const schema = {
  tags: ['CheckList'],
  summary: 'updateChecklist',
  description: 'updateChecklist',
  body: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
      },
      role_id: {
        type: 'integer',
      },
      name: { type: 'string' },
      desc: { type: 'string' },
      type: { type: 'string' },
      enable: { type: 'integer' },
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
      description: 'Checklist updated',
      type: 'object',
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
