const schema = {
  tags: ['Reports'],
  summary: 'postMailBody',
  description: 'postMailBody',
  body: {
    type: 'object',
    properties: {
      type: { type: 'string' },
      text: { type: 'string' },
    }
  },
  response: {
    200: {
      description: 'Post MailBody',
      type: 'object',
      properties: {
        id: { type: 'integer' },
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
