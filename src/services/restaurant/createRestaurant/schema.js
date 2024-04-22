const schema = {
  tags: ['Restaurant'],
  summary: 'createRestaurant',
  description: 'createRestaurant',
  body: {
    type: 'object',
    required: ['name', 'category', 'food_type', 'rut', 'start_date', 'spa_name', 'logo_url'],
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
  },
  response: {
    200: {
      description: 'Restaurant created',
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },201: {
      description: 'Restaurant Created',
      type: 'object',
      properties: {
        id: { type: 'number' },
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
