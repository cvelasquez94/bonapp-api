'use strict'
module.exports = (req, reply, done) => {
  if (req.method === 'OPTIONS') {
    reply.statusCode = 200
    reply.header('access-control-max-age', '86400') // 86400: 24 hs
  }
  reply.header('access-control-allow-origin', '*')
  reply.header('access-control-allow-methods', 'GET, POST, DELETE, HEAD, OPTIONS')
  reply.header('access-control-allow-headers', 'Origin, X-Requested-With, Content-Type, Accept, Range, Authorization, X-Request-ID')

  if (req.method === 'HEAD') {
    return reply.send('')
  }
  if (req.method === 'OPTIONS') {
    return reply.send('')
  }
  done()
}
