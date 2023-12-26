'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getCheckList } = require('./service')(fastify)

  fastify.get('/getSTaskInstance', { schema }, async(request, reply) => {
    const { roleid, branchid, limit } = request.query
    console.log(roleid, branchid)
    const checkList = await getCheckList(roleid, branchid, limit)
    console.log(JSON.stringify(checkList))
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
