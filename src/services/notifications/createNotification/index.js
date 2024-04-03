'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createNotification } = require('./service')(fastify);
  fastify.post('/createNotification', { schema }, async (request, reply) => {
    try {
      const newNoti = await createNotification(request.body);

      return reply.status(200).send(newNoti);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  });
  next();
};

module.exports = route;
