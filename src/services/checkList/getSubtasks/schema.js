const schema = {
  tags: ['CheckList'],
  summary: 'getSubTasks',
  description: 'subTasks',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'string'
      },
      roleid: {
        type: 'string'
      },
      userId: {
        type: 'integer'
      },
      checkListId: {
        type: 'integer'
      },
      dateNow: {
        type: 'string'
      }
    }
  },
  response: {
    200: {
      description: 'Get check list',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' },
          desc: { type: 'string' },
          comment: { type: 'string' },
          expiration: { type: ['string', 'null'] },
          status: { type: 'string' },
          mainTask_id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          orden: { type: 'integer' },
          scoreMultiplier: { type: 'integer' },
          sTaskInstances : {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {type: 'integer'},
                comment: {type: 'string'},
                score: {type: 'integer'},
                status: { type: 'string' },
                documents : {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {type: 'integer'},
                      name: {type: 'string'},
                      url: { type: 'string' },
                    }
                  }
                }
              }
            }
          }
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
