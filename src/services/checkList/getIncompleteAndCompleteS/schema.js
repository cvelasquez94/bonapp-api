const schema = {
  tags: ['CheckList'],
  summary: 'getChecklist',
  description: 'check list',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'string',
      },
      roleid: {
        type: 'string',
      },
      limit: {
        type: 'integer',
      },
      status: {
        type: 'string',
      },
      userId: {
        type: 'integer',
      },
      dateNow: {
        type: 'string',
      },
    },
  },
  response: {
    200: {
      description: 'Get check list',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          role_id: { type: 'integer' },
          user_id: { type: 'integer' },
          name: { type: 'string' },
          desc: { type: 'string' },
          type: { type: 'string' },
          isFinalized: { type: 'boolean' },
          enable: { type: 'boolean' },
          schedule_start: { type: ['string', 'null'] },
          schedule_end: { type: ['string', 'null'] },
          branch_id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          subtasksComplete: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                desc: { type: 'string' },
                expiration: { type: ['string', 'null'] },
                mainTask_id: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                orden: { type: 'integer' },
              },
            },
          },
          subtasksIncomplete: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                desc: { type: 'string' },
                expiration: { type: ['string', 'null'] },
                mainTask_id: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                orden: { type: 'integer' },
              },
            },
          },
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
