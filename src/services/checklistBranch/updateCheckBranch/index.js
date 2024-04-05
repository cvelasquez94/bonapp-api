'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateCheckBranch } = require('../updateCheckBranch/service')(fastify);
  fastify.post('/updateCheckBranch', { schema }, async (request, reply) => {
    
    try {
      const newCb = await updateCheckBranch(request.body);
      
      return reply.status(200).send(newCb);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
