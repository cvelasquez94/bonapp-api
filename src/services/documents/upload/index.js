'use strict';

const schema = require('./schema');
const multer = require('fastify-multer') // or import multer from 'fastify-multer'
const uploadMulter = multer()

const route = async (fastify, opts, next) => {
  const { upload } = require('./service')(fastify);
  
  fastify.post('/upload', { preHandler: uploadMulter.single('file') }, async (request, reply) => {

    const file = request.file;
    const chunkNumber = Number(request.body.chunkNumber);
    const totalChunks = Number(request.body.totalChunks);
    const fileName = request.body.originalname;

    const document = await upload({file, chunkNumber, totalChunks, fileName});
    return reply.type('application/json').send({
      message: 'ok',
      id: 1234,
    });
  });
  next();
};

module.exports = route;
