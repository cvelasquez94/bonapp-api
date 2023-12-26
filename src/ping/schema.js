'use strict'
const schema = {
  tags: ['common'],
  summary: 'Ping',
  description: 'Returns pong',
  response: {
    200: {
      description: 'pong',
      type: 'string'
    }
  }
}

module.exports = schema
