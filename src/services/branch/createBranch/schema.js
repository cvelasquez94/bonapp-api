const schema = {
  tags: ['Branch'],
  summary: 'createBranch',
  description: 'createBranch',
  body: {
    type: 'object',
    required: ['name', 'address', 'rut', 'restaurant_id'],
    properties: {
      id: { type: 'integer' },
      name: { type: 'string' },
      short_name: { type: 'string' },
      address: { type: 'string' },
      rut: { type: 'string' },
      patent_url: { type: 'string' },
      restaurant_id: { type: 'integer' },
      enable: { type: 'integer' },
    }
  },
  response: {
    200: {
      description: 'Branch created',
      type: 'object',
      properties: {
        id: { type: 'number' },
      },
    },201: {
      description: 'Branch Created',
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
