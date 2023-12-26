'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { signIn } = require('./service')(fastify)

  fastify.post('/signIn', { schema }, async(request, reply) => {
    const { email, pwd } = request.body
    const user = await signIn(email, pwd)
    console.log(user)
    if (user == null) {
      reply.status(401).send({ message: 'Invalid username or password' })
    } else {
      const token = fastify.jwt.sign({ firstName: user.firstName, lastName: user.lastName, role_id: user.roleId })
      return reply
        .type('application/json')
        .send({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          role_id: user.role_id,
          avatar: user.avatar,
          token
        })
    }
  })
  next()
}

module.exports = route
