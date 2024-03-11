const schema = {
  tags: ['getUser'],
  summary: 'getUser',
  description: 'getUser',
  query: {
    type: 'object',
    properties: {
      email: {
        type: 'string',
      },
      id: {
        type: 'integer',
      },
    },
    "oneOf": [
      {
          "required": [
              "email"
          ]
      },
      {
          "required": [
              "id"
          ]
      },
    ]
  },
  response: {
    200: {
      description: 'User created',
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        birthDate: {
          type: 'string',
        },
        avatar: {
          type: 'string',
        },
        rut: {
          type: 'string',
        },
        sex: {
          type: 'string',
        },
        roles: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
        branches: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
        statusId: {
          type: 'integer',
        },
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
