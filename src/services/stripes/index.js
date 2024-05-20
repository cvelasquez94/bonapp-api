'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
 const { getStrip } = require('./service')(fastify)

  fastify.get('/getStrip', { schema }, async(request, reply) => {
    const { category, search } = request.query
 
    const stripe = await getStrip(category, search)

    if (stripe == null) {
      reply.status(404).send({ message: 'not strip' })
    } else {
      return reply
        .type('application/json')
        .send(stripe)
    }
  })
  next()
}

module.exports = route
