'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getSubTask } = require('./service')(fastify)

  fastify.get('/getSubTask', { schema }, async(request, reply) => {
    const { id } = request.query
    const SubTask = await getSubTask(id)
    
    if (SubTask == null) {
      reply.status(404).send({ message: 'not SubTask' })
    } else {
      return reply
        .type('application/json')
        .send(SubTask)
    }
  })
  next()
}

module.exports = route
