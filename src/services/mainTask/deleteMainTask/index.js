'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteMainTask } = require('./service')(fastify);
  fastify.delete('/deleteMainTask', { schema }, async (request, reply) => {
    
    try {
      const newB = await deleteMainTask(request.query);
      
      return reply.status(204).send(newB);
      
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
