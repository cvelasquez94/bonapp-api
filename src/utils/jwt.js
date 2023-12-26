'use strict'
const jwt = require('fastify-jwt')
const ResponseError = require('./ResponseError')

module.exports = fastify => {
  fastify.register(jwt, fastify.config.jwt)

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      const decoded = await request.jwtVerify()
      request.jwt = decoded
    } catch (err) {
      throw new ResponseError(err)
    }
  })
}
