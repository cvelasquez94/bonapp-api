'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteBranch } = require('./service')(fastify);
  fastify.delete('/deleteBranch', { schema }, async (request, reply) => {
    
    try {
      const newB = await deleteBranch(request.query);
      
      return reply.status(204).send(newB);
      
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
