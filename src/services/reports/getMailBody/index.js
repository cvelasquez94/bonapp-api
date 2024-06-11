'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getMailBody } = require('./service')(fastify)

  fastify.get('/getMailBody', { schema }, async(request, reply) => {
    const { type } = request.query
    const MailBody = await getMailBody(type)
    
    if (MailBody == null) {
      reply.status(404).send({ message: 'not MailBody' })
    } else {
      return reply
        .type('application/json')
        .send(MailBody)
    }
  })
  next()
}

module.exports = route
