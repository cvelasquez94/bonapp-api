const schema = {
  tags: ['Files'],
  summary: 'postFile',
  description: 'postFile',
  body: {
    type: 'object',
    properties: {
      FileName: { type: 'string' },
      FileType: { type: 'string' },
      FileSize: { type : 'integer' },
      FilePath: { type: 'string' },
      Category: { type: 'string' },
      Category_ID: { type : 'integer' },
      Preview: { type: 'string'},
      Description: { type: 'string' },
    },
  },
  response: {
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
