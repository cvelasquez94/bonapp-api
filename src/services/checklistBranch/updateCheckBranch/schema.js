const schema = {
  tags: ['checklistBranch'],
  summary: 'updateCheckBranch',
  description: 'updateCheckBranch',
  body: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
      user_id: { type: 'integer' },
      role_id: { type: 'integer' },
      enable: { type: 'integer' },
      start_date: { 
        type: 'string',
        format: 'date-time', },
      end_date: { 
        type: 'string',
        format: 'date-time', },
      freqType: { type: 'string' },
      freqValue: { type: 'integer' },
      flagRecurrent: { type: 'integer' },
      monday: { type: 'integer' },
      tuesday: { type: 'integer' },
      wednesday: { type: 'integer' },
      thursday: { type: 'integer' },
      friday: { type: 'integer' },
      saturday: { type: 'integer' },
      sunday: { type: 'integer' },
    },
  },
  response: {
    200: {
      description: 'ChecklistBranch updated',
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
