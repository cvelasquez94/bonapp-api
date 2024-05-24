'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { notificationTo } = require('./service')(fastify);
  const { getTokenUser } = require('../../../tokenUser/getTokenUser/service')(fastify);

  fastify.get('/notificationToUser', { schema }, async (request, reply) => {
    // console.log(request.headers)
    const { userId, checklistName, userFrom } = request.query;
    const { authorization } = request.headers;
    
    const tokenUser = await getTokenUser(userId);
    await notificationTo(tokenUser, authorization, checklistName, userFrom)
    return reply.type('application/json').send();
  });
  next();
};

module.exports = route;
