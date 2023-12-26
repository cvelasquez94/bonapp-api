'use strict'
const pack = require('../../package.json')
// const variables = require('../../config/variables')
const EXPOSE_API = true

module.exports = fastify => {
  fastify.register(require('@fastify/swagger'), {
    exposeRoute: EXPOSE_API || '',
    routePrefix: '/base/doc',
    swagger: {
      info: {
        title: pack.config.fullName,
        description: pack.description,
        version: pack.version
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Swagger info here'
      },
      schemes: fastify.config.schemes,
      host: fastify.config.host,
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'common', description: 'Anon stat end-points' }
      ],
      securityDefinitions: {
        // keyScheme: {
        //   description: 'Authorization Bearer',
        //   type: 'apiKey',
        //   name: 'Authorization',
        //   in: 'header'
        // },
        keyAdminScheme: {
          description: 'Authorization Bearer',
          type: 'apiKey',
          name: 'Authorization',
          in: 'header'
        }
      }
    }
  })
}
