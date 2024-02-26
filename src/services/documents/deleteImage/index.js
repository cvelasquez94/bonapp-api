'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteImage } = require('./service')(fastify);
  //TODO: mejora, enviar solamente instance_id, hoy en dia se envia substak_id en staskInstance_id
  fastify.delete('/deleteImage', { schema }, async (request, reply) => {
    const { id } =
      request.body;
    const document = await deleteImage({
      id
    });
    return reply.type('application/json').send({
      message: 'ok'
    });
  });
  next();
};

module.exports = route;
