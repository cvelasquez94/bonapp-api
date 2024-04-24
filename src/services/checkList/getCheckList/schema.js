const schema = {
  tags: ['CheckList'],
  summary: 'getChecklist',
  description: 'check list',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'string'
      },
      roleid: {
        type: 'string'
      },
      limit: {
        type: 'integer'
      }
    }
  },
  response: {
    200: {
      description: 'Get check list',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          idCheckBranch: { type: 'integer' },
          role_id: { type: 'integer' },
          user_id: { type: 'integer' },
          name: { type: 'string' },
          desc: { type: 'string' },
          type: { type: 'string' },
          enable: { type: 'integer' },
          enableChecklist: { type: 'integer' },
          schedule_start: { type: 'string', format: 'date-time' },
          schedule_end: { type: 'string', format: 'date-time' },
          branch_id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
        }
      }
    },
    400: {
      description: 'Bad request',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    401: {
      description: 'Invalid username or password',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    404: {
      description: 'Could not provision',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    },
    500: {
      description: 'Generic server error',
      type: 'object',
      properties: {
        error: { type: 'string' },
        message: { type: 'string' }
      }
    }
  }
}

module.exports = schema
