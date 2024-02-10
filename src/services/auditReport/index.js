'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createPDFAndSendEmail } = require('./service')(fastify);

  fastify.get('/auditReport', { schema }, async (request, reply) => {
    const { userId, branchId, checkListId, dateNow } = request.query;
    console.log(userId, branchId);
    await createPDFAndSendEmail({ userId, branchId, checkListId, dateNow }, '');
    return reply.type('application/json').send({ message: 'ok' });
  });
  next();
};

module.exports = route;
