'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getCategories } = require('./service')(fastify);

  fastify.get('/getCategories', { schema }, async (request, reply) => {
    const res = await getCategories(request.query);
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
