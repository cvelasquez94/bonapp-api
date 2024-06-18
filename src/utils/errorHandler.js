'use strict'

const { sendLogToLoggly } = require('../core/logger')

function errorHandler(error, request, reply) {
  console.log('errorHandler errorHandler')
  const statusCode = error.status || error.statusCode || 500

  const toLog = {
    error: error.statusMessage || error.message,
    statusMessage: error.statusMessage || error.message,
    statusCode,
    status: statusCode,
    message: error.message || error.message,
    body: error.body || error.body
  }

  request.log.error(error)
  sendLogToLoggly('error', toLog, { stack: error.stack })
  // logger.error(error)

  reply.code(statusCode).send(toLog)
}

module.exports = errorHandler
