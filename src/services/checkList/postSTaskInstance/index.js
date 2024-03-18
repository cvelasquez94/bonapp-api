'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { createSTaskInstance } = require('./service')(fastify)

  fastify.post('/postSubTask', { schema }, async(request, reply) => {
    try {
      console.log(request.body)
      const { subTaskId, userId, status, dateTime, comment, score, photo, dateNow } = request.body;
      const newSTaskInstance = await createSTaskInstance({ subTaskId, userId, branchId, status, dateTime, comment, score, photo, dateNow });
      
      return reply.status(201).send(newSTaskInstance);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
}

module.exports = route
