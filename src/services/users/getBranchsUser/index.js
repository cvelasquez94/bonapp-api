'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getBranchsUser } = require('../getBranchsUser/service')(fastify);
  fastify.get('/getBranchsUser', { schema }, async (request, reply) => {
    const { userId } = request.query;
    const res = await getBranchsUser(userId);
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
