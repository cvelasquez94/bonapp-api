const schema = {
  tags: ['CheckList'],
  summary: 'getSTaskInstance',
  description: 'check getSTaskInstance',
  query: {
    type: 'object',
    properties: {
      subTaskId: {
        type: 'integer'  
      },
      userId: {
        type: 'integer'
      },
      dateTime: {
        type: 'string',
        format: 'date-time',
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
