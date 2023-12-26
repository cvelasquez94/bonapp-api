'use strict'
const variables = require('./variables')
const prefix = `/${variables.config.prefix}/v1`
const port = variables.config.port

const TWO_MONTHS = 60 * 60 * 24 * 30 * 2 // secs * min * hrs * days * months

const config = {
  prefix,
  port,
  pino: {
    level: 'info',
    timestamp: () => ',"time":"' + (new Date()).toISOString() + '"'
  },
  jwt: {
    secret: variables.secret,
    exp: TWO_MONTHS
  },
  schemes: ['https', 'http'],
  email: variables.mail
}

module.exports = config
