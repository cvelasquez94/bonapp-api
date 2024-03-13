'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteCheckBranch } = require('../deleteCheckBranch/service')(fastify);
  fastify.delete('/deleteCheckBranch', { schema }, async (request, reply) => {
    
    try {
      const newB = await deleteCheckBranch(request.query);
      
      return reply.status(204).send(newB);
      
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
