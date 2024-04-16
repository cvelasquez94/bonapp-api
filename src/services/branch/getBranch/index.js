'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getBranch } = require('./service')(fastify)

  fastify.get('/getBranch', { schema }, async(request, reply) => {
    const { branchid, restaurantid, limit } = request.query
 
    const branch = await getBranch(branchid, restaurantid, limit)

    if (branch == null) {
      reply.status(404).send({ message: 'not branch' })
    } else {
      return reply
        .type('application/json')
        .send(branch)
    }
  })
  next()
}

module.exports = route
