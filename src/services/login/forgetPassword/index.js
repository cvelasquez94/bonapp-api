'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { forgetPassword } = require('./service')(fastify);

  fastify.post('/forgetPassword', { schema }, async (request, reply) => {
    const { email } = request.body;
    const user = await forgetPassword(email);
  });
  next();
};

module.exports = route;
