'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getPendingNotificationCount } = require('./service')(fastify);

  fastify.get('/getPendingNotificationCount', { schema }, async (request, reply) => {
    const { userId } = request.query;
    const res = await getPendingNotificationCount(userId);
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
