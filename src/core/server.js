'use strict';
const config = require('../../config/config');
const { app, logger } = require('./app');
const {sendLogToLoggly} = require('./logger') 

if(config.environment === 'PROD'){
  console.log(config.environment, 'asd');
  require('../cron/scheduleCron');
}

async function start() {
  try {
    const fastify = await app();
    await fastify.listen({ port: config.port, host: '0.0.0.0' });
  } catch (err) {
    sendLogToLoggly('error', err, { stack: err.stack })
    logger.error(err);
    process.exit(1);
  }
}

start();
