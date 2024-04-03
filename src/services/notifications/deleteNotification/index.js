'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteUser } = require('./service')(fastify);
  fastify.delete('/deleteNotification', { schema }, async (request, reply) => {
    try {
      const noti = await deleteUser(request.query);

      return reply.status(204).send(noti);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  });
  next();
};

module.exports = route;
