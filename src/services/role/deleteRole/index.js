'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteRole } = require('./service')(fastify);
  fastify.delete('/deleteRole', { schema }, async (request, reply) => {
    
    try {
      const newR = await deleteRole(request.query);
      
      return reply.status(204).send(newR);
      
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
