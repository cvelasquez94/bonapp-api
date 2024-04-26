'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getRoles } = require('./service')(fastify)

  fastify.get('/getRoles', { schema }, async(request, reply) => {
    const { limit } = request.query
 
    const Roles = await getRoles(limit)

    if (Roles == null) {
      reply.status(404).send({ message: 'not Roles' })
    } else {
      return reply
        .type('application/json')
        .send(Roles)
    }
  })
  next()
}

module.exports = route
