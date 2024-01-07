const schema = {
    tags: ['Documents'],
    summary: 'postImage',
    description: 'upload images and post table documents',
    body: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'url upload images'
        },
        name: {
          type: 'string',
          description: 'name image'
        },
        desc: {
            type: 'string',
            description: 'description to long',
        },
        staskInstanceId: {
            type: 'integer',
            description: '',
        }
      }
    },
    response: {
      200: {
        description: 'Bad request',
        type: 'object',
        properties: {
          message: { type: 'string'},
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
  