const schema = {
  tags: ['Branch'],
  summary: 'getBranch',
  description: 'branch',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'integer'
      },
      restaurantid: {
        type: 'integer'
      },
      limit: {
        type: 'integer'
      }
    }
  },
  response: {
    200: {
      description: 'Get branch',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          address: { type: 'string' },
          rut: { type: 'string' },
          patent_url: { type: 'string' },
          restaurant_id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          short_name: { type: 'string' },
          enable: { type: 'integer' },
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
