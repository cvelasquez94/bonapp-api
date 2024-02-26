'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { postImage } = require('./service')(fastify);
  //TODO: mejora, enviar solamente instance_id, hoy en dia se envia substak_id en staskInstance_id
  fastify.post('/postImage', { schema }, async (request, reply) => {
    const { url, name, desc, staskInstance_id, user_id, dateNow } =
      request.body;
    const document = await postImage({
      url,
      name,
      desc,
      staskInstance_id,
      user_id,
      dateNow,
    });
    return reply.type('application/json').send({
      message: 'ok',
      id: document.dataValues.id,
    });
  });
  next();
};

module.exports = route;
