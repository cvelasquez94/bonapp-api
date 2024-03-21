'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { signIn } = require('./service')(fastify);

  fastify.post('/signIn', { schema }, async (request, reply) => {
    const { email, pwd } = request.body;
    const user = await signIn(email, pwd);
    //console.log(user);
    if (user == null) {
      reply.status(401).send({ message: 'Invalid username or password' });
    } else {
      const token = fastify.jwt.sign({
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      });
      return reply.type('application/json').send({
        id: user.id,
        status_id: user.status_id,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        avatar: user.avatar,
        branch_id: user.branch_id,
        branches: user.branches,
        token,
      });
    }
  });
  next();
};

module.exports = route;
