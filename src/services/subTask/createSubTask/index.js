'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createSubTask } = require('./service')(fastify);
  fastify.put('/createSubTask', { schema }, async (request, reply) => {
    
    try {
      const newSt = await createSubTask(request.body);
      
      return reply.status(201).send(newSt);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
