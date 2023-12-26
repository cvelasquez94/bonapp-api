'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getSubTasks } = require('./service')(fastify)

  fastify.get('/getSubTasks', { schema }, async(request, reply) => {
    const { roleid, branchid, limit, userId } = request.query
    console.log(roleid, branchid, userId)
    const subTasks = await getSubTasks(roleid, branchid, limit, userId)
    if (subTasks == null) {
      reply.status(404).send({ message: 'not checklist' })
    } else {
      return reply
        .type('application/json')
        .send(subTasks)
    }
  })
  next()
}

module.exports = route
