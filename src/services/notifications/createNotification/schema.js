const schema = {
  tags: ['notifications'],
  summary: 'createNotification',
  description: 'createNotification',
  body: {
    type: 'object',
    required: ['body', 'title'],
    properties: {
      messageId: {
        type: 'string',
      },
      title: {
        type: 'string',
      },
      body: {
        type: 'string',
      },
      dataCustom: {
        type: 'string',
      },
      type: {
        type: 'string',
      },
      from: {
        type: 'string',
      },
      device: {
        type: 'string',
      },
      statusId: {
        type: 'integer',
      },
      obs: {
        type: 'string',
      },
      sentTime: {
        type: 'string',
        format: 'date-time',
      },
    },
  },
  response: {
    200: {
      description: 'Notification Created',
      type: 'object',
      properties: {
        id: { type: 'number' },
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
