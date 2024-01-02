const schema = {
  tags: ['CheckList'],
  summary: 'getChecklist',
  description: 'check list',
  query: {
    type: 'object',
    properties: {
      branchid: {
        type: 'string'
      },
      roleid: {
        type: 'string'
      },
      limit: {
        type: 'integer'
      },
      status: {
        type: 'string'
      },
      userId: {
        type: 'integer'
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
          role_id: { type: 'integer' },
          name: { type: 'string' },
          desc: { type: 'string' },
          type: { type: 'string' },
          enable: { type: 'boolean' },
          schedule_start: { type: ['string', 'null'] },
          schedule_end: { type: ['string', 'null'] },
          branch_id: { type: 'integer' },
          createdAt: { type: 'string' },
          updatedAt: { type: 'string' },
          mainTasks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: ['string', 'null'] },
                desc: { type: 'string' },
                schedule_start: { type: ['string', 'null'] },
                schedule_end: { type: ['string', 'null'] },
                checkList_id: { type: 'integer' },
                createdAt: { type: 'string' },
                updatedAt: { type: 'string' },
                subTasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'integer' },
                      name: { type: 'string' },
                      desc: { type: 'string' },
                      expiration: { type: ['string', 'null'] },
                      mainTask_id: { type: 'integer' },
                      status: { tupe: 'string' },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' }
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
