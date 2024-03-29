'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getCheckList } = require('./service')(fastify)
  // const { getCheckList } = require('../getCheckListFilter/service')(fastify) 
  fastify.get('/getIncompleteAndCompleteS', { schema }, async(request, reply) => {
    const { roleid, branchid, limit, status, userId, dateNow} = request.query
    console.log(roleid, branchid ,status, userId, dateNow )
    const checkList = await getCheckList(roleid, userId, branchid, dateNow)
    if (checkList == null) {
      reply.status(404).send({ message: 'not checklist' })
    } else {
      return reply
        .type('application/json')
        .send(checkList)
    }
  })
  next()
}

module.exports = route  
