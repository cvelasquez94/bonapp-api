const schema = {
  tags: ['checklistBranch'],
  summary: 'getCheckBranch',
  description: 'getCheckBranch',
  query: {
    type: 'object',
    properties: {
      checklist_id: {
        type: 'integer',
      },
      branch_id: {
        type: 'integer',
      },
    },
  },
  response: {
    200: {
      description: 'ChecklistBranch found',
      type: 'array',
      properties: {
        id: { type: 'number' },
        checklist_id: { type: 'number' },
        branch_id: { type: 'number' },
        role_id: { type: 'number' },
        user_id: { type: 'number' },        
        freqType: { type: 'string' }, 
        freqValue: { type: 'number' },
        enable: {
          type: 'integer',
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
