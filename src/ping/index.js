'use strict'
const schema = require('./schema')

module.exports = async function (fastify, opts, next) {
  fastify.get('/ping', { schema }, async (request, reply) => {
    reply.type('application/json').send('pong')
  })
  next()
}
