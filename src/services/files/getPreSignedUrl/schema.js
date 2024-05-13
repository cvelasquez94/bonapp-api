const schema = {
    tags: ['Files'],
    summary: 'getPreSignedUrl',
    description: 'getPreSignedUrl',
    query: {
        type: 'object',
        properties: {
            bucketName: {type: 'string'},
            objectName: {type: 'string'},
            expirationTimeInSeconds: {type: 'integer'},
        }
      },
    response: {
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
  