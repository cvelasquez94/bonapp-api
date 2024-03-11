'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { createUser } = require('../createUser/service')(fastify);
  fastify.put('/createUser', { schema }, async (request, reply) => {
    
    try {
      //const { mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId } = request.body;
      //const newUser = await createUser({ mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId });
      const newUser = await createUser(request.body);
      
      return reply.status(201).send(newUser);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
