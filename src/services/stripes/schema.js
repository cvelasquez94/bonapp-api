const schema = {
    tags: ['Strip'],
    summary: 'getStip',
    description: 'getStip',
    query: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
        },
        search: { type: 'string'}
      }
    },
    response: {
      200: {
        description: 'Get Strip configurations',
        type: 'array',
        items: {
          type: 'object',
          properties: {
            ID: { type: 'integer' },
            FileName: {type: 'string' },
            FileType: {type: 'string' },
            FileSize: {type: 'integer' },
            FilePath: {type: 'string' },
            Category: {type: 'string' },
            Preview: {type: 'string' },
            Description: {type: 'string' },
            Rating: {type: 'integer' },
            Duration: {type: 'integer' },
            label: {type: 'string' },
          }
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
  