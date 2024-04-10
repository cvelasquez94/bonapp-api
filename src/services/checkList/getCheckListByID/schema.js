const schema = {
  tags: ['CheckList'],
  summary: 'getCheckListByID',
  description: 'getCheckListByID',
  query: {
    type: 'object',
    required: [ 'id'],
    properties: {
      id: {
        type: 'integer'
      }
    }
  },
  response: {
    200: {
      description: 'Get check list',
       type: 'array',
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
