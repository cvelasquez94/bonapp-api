'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createTokenUser } = require('./service')(fastify);
  fastify.post('/createTokenUser', { schema }, async (request, reply) => {
    try {
      const newNoti = await createTokenUser(request.body);

      return reply.status(200).send(newNoti);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  });
  next();
};

module.exports = route;
