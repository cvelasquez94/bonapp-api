'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createRole } = require('./service')(fastify);
  fastify.put('/createRole', { schema }, async (request, reply) => {
    
    try {
      const newR = await createRole(request.body);
      
      return reply.status(201).send(newR);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
