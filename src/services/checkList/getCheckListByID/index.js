'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getCheckListByID } = require('./service')(fastify)

  fastify.get('/getCheckListByID', { schema }, async(request, reply) => {
    const { id } = request.query
    
    const checkList = await getCheckListByID(id)
    
    if (checkList == null) {
      reply.status(404).send({ message: 'checklist not found' })
    } else {
      return reply
        .type('application/json')
        .send(checkList)
    }
  })
  next()
}

module.exports = route
