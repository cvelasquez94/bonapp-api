const schema = {
  tags: ['login'],
  summary: 'signIn',
  description: 'signIn',
  body: {
    type: 'object',
    required: ['email', 'pwd'],
    properties: {
      email: {
        type: 'string',
        description: 'email of the user'
      },
      pwd: {
        type: 'string',
        description: 'password of the user'
      }
    }
  },
  response: {
    200: {
      description: 'Valid user login',
      type: 'object',
      properties: {
        id: { type: 'integer'},
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        avatar: { type: 'string' },
        role_id: { type: 'integer' },
        token: { type: 'string' },
        branch_id: { type: 'integer' },
        branch_name: { type: 'string' }
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
