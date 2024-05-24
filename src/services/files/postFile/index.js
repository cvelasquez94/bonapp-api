'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { postFile } = require('./service')(fastify);

  fastify.post('/postFiles', { schema }, async (request, reply) => {
    console.log(request.body, 'controller')
    const res = await postFile(request.body);
    return reply.type('application/json').send({id: res.ID});
  });
  next();
};

module.exports = route;
