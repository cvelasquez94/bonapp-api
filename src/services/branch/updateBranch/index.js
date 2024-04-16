'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateBranch } = require('../updateBranch/service')(fastify);
  fastify.post('/updateBranch', { schema }, async (request, reply) => {
    
    try {
      const newCb = await updateBranch(request.body);
      
      return reply.status(200).send(newCb);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
