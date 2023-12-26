'use strict'

function errorHandler(error, request, reply) {
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

  reply.code(statusCode).send(toLog)
}

module.exports = errorHandler
