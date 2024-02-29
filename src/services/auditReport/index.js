'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createPDFAndSendEmail } = require('./service')(fastify);

  fastify.get('/auditReport', { schema }, async (request, reply) => {
    const { userId, branchId, checkListId, dateNow, comment, flagPreview } = request.query;
    console.log(userId, branchId);
    const pdfres = await createPDFAndSendEmail({ userId, branchId, checkListId, dateNow, comment, flagPreview }, '');
    return reply.type('application/json').send({ 
      message: pdfres.message,
      fileName: pdfres.fileName,
      contentType: pdfres.contentType,
      base64: pdfres.base64,
    });
  });
  next();
};

module.exports = route;
