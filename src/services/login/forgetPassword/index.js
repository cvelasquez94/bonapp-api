'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { forgetPassword } = require('./service')(fastify);

  fastify.post('/forgetPassword', { schema }, async (request, reply) => {
    const { email } = request.body;
    await forgetPassword(email);

    return reply.type('application/json').send({
      message: 'ok',
    });
  });
  next();
};

module.exports = route;
