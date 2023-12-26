module.exports = {
  serializers: {
    req,
    res,
  },
}

function req(request) {
  return ''
}

function res(reply) {
  return {
    stat: reply.statusCode,
    meth: reply.request.method,
    url: reply.request.url,
    addr: reply.request.ip,
  }
}
