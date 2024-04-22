'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateRestaurant } = require('../updateRestaurant/service')(fastify);
  fastify.post('/updateRestaurant', { schema }, async (request, reply) => {
    
    try {
      const newCb = await updateRestaurant(request.body);
      
      return reply.status(200).send(newCb);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
