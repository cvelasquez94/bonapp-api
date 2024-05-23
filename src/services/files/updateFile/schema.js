const schema = {
  tags: ['Files'],
  summary: 'updateFile',
  description: 'updateFile',
  body: {
    type: 'object',
    properties: {
      ID: { type : 'integer' },
      FileName: { type: 'string' },
      //FileType: { type: 'string' },
      FileSize: { type : 'integer' },
      FilePath: { type: 'string' },
      Category: { type: 'string' },
      Preview: { type: 'string'},
      Description: { type: 'string' },
      branches: {
        type: 'array',
        items: {
          type: 'integer',
        },
      },
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
