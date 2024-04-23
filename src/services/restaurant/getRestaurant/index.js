'use strict'

const schema = require('./schema')

const route = async (fastify, opts, next) => {
  const { getRestaurant } = require('./service')(fastify)

  fastify.get('/getRestaurant', { schema }, async(request, reply) => {
    const { restaurantid, limit } = request.query
 
    const restaurant = await getRestaurant(restaurantid, limit)

    if (restaurant == null) {
      reply.status(404).send({ message: 'not restaurant' })
    } else {
      return reply
        .type('application/json')
        .send(restaurant)
    }
  })
  next()
}

module.exports = route
