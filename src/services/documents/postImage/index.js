'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { postImage } = require('./service')(fastify)

  fastify.post('/postImage', { schema }, async(request, reply) => {
    const { url, name, desc, staskInstance_id, user_id} = request.body
    const image = await postImage({ url, name, desc, staskInstance_id, user_id})
    return reply
      .type('application/json')
      .send({
          message: 'ok'
      })
  })
  next()
}

module.exports = route
