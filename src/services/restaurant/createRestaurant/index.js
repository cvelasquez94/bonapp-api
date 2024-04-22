'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createRestaurant } = require('./service')(fastify);
  fastify.put('/createRestaurant', { schema }, async (request, reply) => {
    
    try {
      const newBr = await createRestaurant(request.body);
      
      return reply.status(201).send(newBr);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
