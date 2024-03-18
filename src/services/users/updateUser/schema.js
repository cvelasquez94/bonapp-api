const schema = {
  tags: ['users'],
  summary: 'updateUser',
  description: 'updateUser',
  body: {
    type: 'object',
    required: ['email'],
    properties: {
      email: {
        type: 'string',
      },
      firstName: {
        type: 'string',
      },
      lastName: {
        type: 'string',
      },
      birthDate: {
        type: 'string',
        pattern: '[0-9]{2}[/-][0-9]{2}[/-][0-9]{4}',
      },
      avatar: {
        type: 'string',
      },
      rut: {
        type: 'string',
      },
      sex: {
        type: 'string',
        enum: ['M', 'F', 'X'],
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
      directActiveFlag: {
        type: 'integer',
        description:
          'if this is 1, pwd and status Must be passed to create User without receiving mail',
      },
      pwd: {
        type: 'string',
      },
      statusId: {
        type: ['integer', 'null'],
        nullable: true,
        description: 'status Id',
      },
      phone: {
        type: 'string',
        description: 'Phone number',
      },
    },
  },
  response: {
    200: {
      description: 'User updated',
      type: 'object',
      properties: {
        id: { type: 'number' },
        email: { type: 'string' },
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
