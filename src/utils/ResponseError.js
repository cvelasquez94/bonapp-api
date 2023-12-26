'use strict'
class ResponseError extends Error {
  constructor(response) {
    const msg = response.message
    super(msg)

    this.statusCode = response.statusCode
    this.message = response.message
    this.err = response
  }
}
module.exports = ResponseError
