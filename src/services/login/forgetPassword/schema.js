const schema = {
  tags: ['login'],
  summary: 'forgetPassword',
  description: 'Forget password',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
        description: 'email of the user',
        format: 'email',
      },
    },
  },
  response: {
    200: {
      description: 'Send email for reset password',
      type: 'object',
      properties: {
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
