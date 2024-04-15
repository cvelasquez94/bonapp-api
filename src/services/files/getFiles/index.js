'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getFiles } = require('./service')(fastify);

  fastify.get('/getFiles', { schema }, async (request, reply) => {
    const res = await getFiles();
    return reply.type('application/json').send(res);
  });
  next();
};

module.exports = route;
