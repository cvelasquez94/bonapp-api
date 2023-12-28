'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createPDFAndSendEmail } = require('./service')(fastify);

  fastify.get('/auditReport', { schema }, async (request, reply) => {
    const { userId, subTaskId } = request.query;
    console.log(userId, subTaskId);
    await createPDFAndSendEmail({ userId: userId }, '');
    return reply.type('application/json').send({ message: 'ok' });
  });
  next();
};

module.exports = route;
