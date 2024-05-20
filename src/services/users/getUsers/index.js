'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getUsers } = require('./service')(fastify)
  fastify.get('/getUsers', { schema }, async (request, reply) => {
    const res = await getUsers(request.query)
    //console.log('RESPONSE INDEX ======> ', res);
    return reply
      .type('application/json')
      .send(res)
  })
  next()
}

module.exports = route
