'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getNotifications } = require('./service')(fastify);

  fastify.get('/getNotifications', { schema }, async (request, reply) => {
    const res = await getNotifications();
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
