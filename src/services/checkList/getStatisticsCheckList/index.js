'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getstatisticsCheckList } = require('./service')(fastify);
  // const { getCheckList } = require('../getCheckListFilter/service')(fastify)
  fastify.get('/getstatisticsCheckList', { schema }, async (request, reply) => {
    const { branchid, status, userId, dateNow } = request.query;
    console.log(branchid, status, userId, dateNow);
    const checkList = await getstatisticsCheckList(userId, branchid, dateNow);
    if (checkList == null) {
      reply.status(404).send({ message: 'not checklist' });
    } else {
      return reply.type('application/json').send(checkList);
    }
  });
  next();
};

module.exports = route;
