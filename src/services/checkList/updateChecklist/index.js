'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateChecklist } = require('./service')(fastify);
  fastify.post('/updateChecklist', { schema }, async (request, reply) => {
    
    try {
      const newCh = await updateChecklist(request.body);
      
      return reply.status(200).send(newCh);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
