const schema = {
  tags: ['Files'],
  summary: 'deleteFile',
  description: 'deleteFile',
  query: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'integer' },
    },
  },
  response: {
    204: {
      description: 'File deleted',
      type: 'object',
     properties: {
       id: { type: 'integer' },
     },
   },
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        id: { type: 'integer' },
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
