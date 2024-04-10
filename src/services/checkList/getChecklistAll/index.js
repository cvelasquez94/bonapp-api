'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getChecklistAll } = require('./service')(fastify);
  fastify.get('/getChecklistAll', { schema }, async (request, reply) => {
    
    try {
      const eChecklists = await getChecklistAll(request.query);
      
      return reply.status(200).send(eChecklists);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
