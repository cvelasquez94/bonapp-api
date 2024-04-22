'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateNotification } = require('./service')(fastify);

  fastify.post('/updateNotification', { schema }, async (request, reply) => {
    try {
      const noti = await updateNotification(request.body);

      return reply.status(200).send(noti);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  });
  next();
};

module.exports = route;
