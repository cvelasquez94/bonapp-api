const schema = {
  tags: ['Documents'],
  summary: 'upload',
  description: 'upload big files',
  body: {
    type: 'object',
    properties: {
      file: {
        type: 'object',
        description: 'upload file',
      },
      chunkNumber: {
        type: 'integer',
        description: 'chuck Number',
      },
      totalChunks: {
        type: 'integer',
        description: 'total Chunks',
      },
      originalname: {
        type: 'string',
        description: ' original name file',
      },     
    },
  },
  response: {
    200: {
      description: 'Bad request',
      type: 'object',
      properties: {
        id: { type: 'integer' },
        message: { type: 'string' },
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
    401: {
      description: 'Invalid username or password',
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
