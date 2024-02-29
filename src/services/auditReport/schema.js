const schema = {
  tags: ['Audit'],
  summary: 'auditReport',
  description: 'subTasks',
  query: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
      },
      branchId: {
        type: 'string',
      },
      checkListId: {
        type: 'string',
      },
      dateNow: {
        type: 'string',
      },
      comment: {
        type: 'string',
      },
      flagPreview: {
        type: 'integer',
      },
    },
  },
  response: {
    200: {
      description: 'Get check list',
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
        fileName: {
          type: 'string',
        },
        contentType: {
          type: 'string',
        },
        base64: {
          type: 'string',
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
