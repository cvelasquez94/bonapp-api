'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { postImage } = require('./service')(fastify)

  fastify.post('/postImage', { schema }, async(request, reply) => {
    const { url, name, desc, staskInstanceId} = request.body
    const image = await postImage({ url, name, desc, staskInstanceId})
    return reply
      .type('application/json')
      .send({
          message: 'ok'
      })
  })
  next()
}

module.exports = route
