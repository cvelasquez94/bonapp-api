'use strict';

const schema = require('./schema');

const route = async (fastify, opts, next) => {
  const { getPreSignedUrl } = require('./service')(fastify);

  fastify.get('/getPreSignedUrl', { schema }, async (request, reply) => {
    const { bucketName, objectName, expirationTimeInSeconds } = request.query;
    const resp = await getPreSignedUrl(bucketName, objectName, expirationTimeInSeconds)
    //console.log(resp);
    return reply.type('application/json').send({ 
      message: 'test',
    });
  });
  next();
};

module.exports = route;
