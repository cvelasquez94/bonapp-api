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
      Preview: { type: 'string'},
      Description: { type: 'string' },
      FileBase64: { type: 'string', description: 'file content in base64'}
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
