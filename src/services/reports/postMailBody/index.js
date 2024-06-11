'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { postMailBody } = require('./service')(fastify)

  fastify.post('/postMailBody', { schema }, async(request, reply) => {
    
    const { type, text } = request.body;

    const MailBody = await postMailBody(type, text)
    
    if (MailBody == null) {
      reply.status(404).send({ message: 'not MailBody' })
    } else {
      return reply
        .type('application/json')
        .send({
          message: 'ok',
          id: MailBody.id,
        })
    }
  })
  next()
}

module.exports = route
