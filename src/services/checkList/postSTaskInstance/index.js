'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { createSTaskInstance } = require('./service')(fastify)

  fastify.post('/postSubTask', { schema }, async(request, reply) => {
    try {
      const { subTaskId, userId, status, dateTime, comment, score, photo } = request.body;
      const newSTaskInstance = await createSTaskInstance({ subTaskId, userId, status, dateTime, comment, score, photo });
      
      return reply.status(201).send(newSTaskInstance);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
}

module.exports = route
