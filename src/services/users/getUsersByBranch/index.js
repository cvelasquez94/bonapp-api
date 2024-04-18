'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getUsersByBranch } = require('./service')(fastify)
  fastify.get('/getUsersByBranch', { schema }, async (request, reply) => {
    const { branchId } = request.query;
    const res = await getUsersByBranch(branchId)
    return reply
      .type('application/json')
      .send(res)
  })
  next()
}

module.exports = route
