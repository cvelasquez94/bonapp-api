'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getCheckBranch } = require('../getCheckBranch/service')(fastify);
  fastify.get('/getCheckBranch', { schema }, async (request, reply) => {
    
    try {
      const cb = await getCheckBranch(request.query);
      
      return reply.status(200).send(cb);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
