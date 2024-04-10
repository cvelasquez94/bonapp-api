'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getTokenUser } = require('./service')(fastify);

  fastify.get('/getTokenUser', { schema }, async (request, reply) => {
    const { userId } = request.query;
    const res = await getTokenUser(userId);
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
