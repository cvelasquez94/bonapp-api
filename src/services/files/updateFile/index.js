'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateFile } = require('./service')(fastify);

  fastify.post('/updateFiles', { schema }, async (request, reply) => {
    const res = await updateFile(request.body);
    return reply.type('application/json').send({id: res.ID});
  });
  next();
};

module.exports = route;
