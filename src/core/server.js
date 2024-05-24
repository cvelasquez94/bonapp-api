'use strict';
const config = require('../../config/config');
const { app, logger } = require('./app');
// require('../cron/scheduleCron');

async function start() {
  try {
    const fastify = await app();
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

start();
