'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getCheckListDue } = require('./service')(fastify);

  fastify.get('/getCheckListDue', { schema }, async (request, reply) => {
    const { interval, time } = request.query;

    const subTasks = await getCheckListDue(interval, time);
    if (subTasks == null) {
      reply.status(404).send({ message: 'not checklist' });
    } else {
      return reply.type('application/json').send(subTasks);
    }
  });
  next();
};

module.exports = route;
