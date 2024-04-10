'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getMainTask } = require('./service')(fastify)

  fastify.get('/getMainTask', { schema }, async(request, reply) => {
    const { id } = request.query
    const MainTask = await getMainTask(id)
    
    if (MainTask == null) {
      reply.status(404).send({ message: 'not MainTask' })
    } else {
      return reply
        .type('application/json')
        .send(MainTask)
    }
  })
  next()
}

module.exports = route
