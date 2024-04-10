'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createChecklist } = require('./service')(fastify);
  fastify.put('/createChecklist', { schema }, async (request, reply) => {
    
    try {
      const newCh = await createChecklist(request.body);
      
      return reply.status(201).send(newCh);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
