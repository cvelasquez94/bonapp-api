const schema = {
  tags: ['Reports'],
  summary: 'getMailBody',
  description: 'getMailBody',
  query: {
    type: 'object',
    properties: {
      type: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      description: 'Get MailBody',
      type: 'object',
      properties: {
        id: { type: 'number' },
        type: { type: 'string' },
        text: { type: 'string' },
        enable: { type: 'number' },
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
