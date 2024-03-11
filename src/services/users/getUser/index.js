'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getUser } = require('../getUser/service')(fastify);
  fastify.get('/getUser', { schema }, async (request, reply) => {
    
    try {
      //const { mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId } = request.query;
      //const newUser = await getUser({ mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId });
      const eUser = await getUser(request.query);
      
      return reply.status(200).send(eUser);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
