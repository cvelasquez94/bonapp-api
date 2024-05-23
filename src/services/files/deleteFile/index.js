'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteFile } = require('./service')(fastify);

  fastify.delete('/deleteFile', { schema }, async (request, reply) => {
    try{
      const res = await deleteFile(request.query);
      return reply.status(204).send(res);
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  });
  next();
};

module.exports = route;
