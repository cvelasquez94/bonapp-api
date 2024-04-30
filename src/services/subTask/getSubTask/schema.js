const schema = {
  tags: ['SubTask'],
  summary: 'getSubTask',
  description: 'getSubTask',
  query: {
    type: 'object',
    properties: {
      id: {
        type: 'integer'
      },
      page: {
        type: 'integer'
      },
      pageSize: {
        type: 'integer'
      }
    }
  },
  response: {
    200: {
      description: 'Get SubTask',
      type: 'object',
      properties: {
        subTasks: { type: 'array'},
        totalItems: { type: 'integer' },
        totalPages: { type: 'integer' },
        currentPage: { type: 'integer' }   
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
