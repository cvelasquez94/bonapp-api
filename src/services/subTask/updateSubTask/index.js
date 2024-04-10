'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateSubTask } = require('./service')(fastify);
  fastify.post('/updateSubTask', { schema }, async (request, reply) => {
    
    try {
      const newSt = await updateSubTask(request.body);
      
      return reply.status(200).send(newSt);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
