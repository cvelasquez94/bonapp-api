'use strict'

module.exports = { log, logString }

function log(obj, ip = '') {
  logString(JSON.stringify(obj), ip)
}

function logString(body, ip = '') {
  const headers = {}
  headers['Content-Type'] = 'application/json'
  if (ip) {
    headers['X-Forwarded-For'] = ip
  }
  console.log({ headers, method: 'POST', body: JSON.stringify(body) })
}
