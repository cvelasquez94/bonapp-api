'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { deleteUser } = require('../deleteUser/service')(fastify);
  fastify.delete('/deleteUser', { schema }, async (request, reply) => {
    
    try {
      //const { email } = request.query;
      //const newUser = await deleteUser({ email });
      const newUser = await deleteUser(request.query);
      
      return reply.status(204).send(newUser);
      
    } catch (error) {
      return reply.status(500).send({ error: error.message });
    }
  })
  next()
  };

module.exports = route;
