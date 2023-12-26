const nock = require('nock')
const { timestamp, zerofill } = require('./index')
const { app, logger } = require('../core/app')
logger.level = 'fatal'

describe('Utils index functions', () => {
  let fastify

  beforeAll(async () => {
    fastify = await app()
  })

  afterAll(() => {
    fastify.close()
  })

  it('Function Request', async () => {
    const url = 'http://www.example.com'
    nock(url).get('/hello').reply(200)
    nock(url).persist().post('/hello', { hola: 'mundo' }).reply(201)

    const [caseGet, casePost, casePostHeaders] = await Promise.all([
      fastify.request(`${url}/hello`),
      fastify.request(`${url}/hello`, { body: { hola: 'mundo' }, method: 'post' }),
      fastify.request(`${url}/hello`, { body: { hola: 'mundo' }, method: 'post', headers: { example: 'hello' } }),
    ])

    expect(caseGet.status).toBe(200)
    expect(casePost.status).toBe(201)
    expect(casePostHeaders.status).toBe(201)
  })

  it('Function RequestJSON', async () => {
    const url = 'http://www.example2.com'
    const res = { hola: 'mundo' }

    nock(url).get('/hello').reply(200, res)
    nock(url).persist().post('/hellos', res).reply(200, res)

    const [caseGet, casePost, casePostHeaders] = await Promise.all([
      fastify.requestJSON(`${url}/hello`),
      fastify.requestJSON(`${url}/hellos`, { body: { hola: 'mundo' }, method: 'post' }),
      fastify.requestJSON(`${url}/hellos`, { body: { hola: 'mundo' }, method: 'post', headers: { example: 'hello' } }),
    ])

    expect(caseGet).toEqual(res)
    expect(casePost).toEqual(res)
    expect(casePostHeaders).toEqual(res)
  })

  it('Function timestamp', async () => {
    const date = timestamp()
    expect(date).not.toBeNull()
  })

  it('Function zerofill', async () => {
    expect(zerofill(9)).toBe('09')
  })
})
