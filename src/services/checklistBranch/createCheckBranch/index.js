'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createCheckBranch } = require('../createCheckBranch/service')(fastify);
  fastify.put('/createCheckBranch', { schema }, async (request, reply) => {
    
    try {
      const newCb = await createCheckBranch(request.body);
      
      return reply.status(201).send(newCb);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
