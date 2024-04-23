const schema = {
  tags: ['Restaurant'],
  summary: 'getRestaurant',
  description: 'getRestaurant',
  query: {
    type: 'object',
    properties: {
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
      description: 'Get restaurant',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          category: { type: 'string' },
          food_type: { type: 'string' },
          rut: { type: 'string' },
          start_date: { type: ['string', 'null'] },
          spa_name: { type: 'string' },
          logo_url: { type: 'string' },
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