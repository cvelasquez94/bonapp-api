'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { updateUser } = require('../updateUser/service')(fastify);
  fastify.post('/updateUser', { schema }, async (request, reply) => {
    
    try {
      //const { mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId } = request.body;
      //const newUser = await updateUser({ mail, firstName, lastName, birthDate, avatar, rut, sex, pwd, statusId });
      const newUser = await updateUser(request.body);
      
      return reply.status(200).send(newUser);

    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
