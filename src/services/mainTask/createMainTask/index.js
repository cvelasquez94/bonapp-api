'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createMainTask } = require('./service')(fastify);
  fastify.put('/createMainTask', { schema }, async (request, reply) => {
    
    try {
      const newMt = await createMainTask(request.body);
      
      return reply.status(201).send(newMt);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
