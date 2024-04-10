'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateMainTask } = require('./service')(fastify);
  fastify.post('/updateMainTask', { schema }, async (request, reply) => {
    
    try {
      const newMt = await updateMainTask(request.body);
      
      return reply.status(200).send(newMt);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
