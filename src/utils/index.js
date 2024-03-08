'use strict';
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fetch = require('node-fetch');
const corsHook = require('./corsHook');
const jwt = require('./jwt');
const logger = require('./logger');
const errorHandler = require('./errorHandler');
const ResponseError = require('./ResponseError');
const openAPI = require('./openapi');
const mail = require('./mail');
const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Request Id generator
 *
 * @param      {Object}  req     The request
 * @return     {String}  the request id
 */
function genReqId(req) {
  const reqId = Date.now();
  return reqId;
}

/**
 * Hashes string with md5 algorythm
 *
 * @param      {String}  str     The string
 * @return     {String}  The md5 string hashed
 */
function md5(str) {
  return crypto.createHash('md5').update(str).digest('hex');
}

/**
 * Fastify request decorator
 *
 * @param      {object}  fastify  The fastify
 */
function request(fastify) {
  fastify.decorate('request', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts);
    const content = { 'Content-Type': 'application/json' };
    if (reqOpts.body && reqOpts.method.toLowerCase() === 'post') {
      /* Fetch needs the body to be stringified */
      reqOpts.body = JSON.stringify(reqOpts.body);
      if (!reqOpts.headers) {
        reqOpts.headers = content;
      }
      const hasContentType = Object.keys(reqOpts.headers).some(
        (header) => header === 'Content-Type'
      );
      if (!hasContentType) {
        reqOpts.headers = { ...reqOpts.headers, ...content };
      }
    }
    fastify.log.info(`${reqOpts.method} request to ${url}`);
    return fetch(url, reqOpts);
  });
}

/**
 * Fastify requestJSON decorator
 *
 * @param      {object}  fastify  The fastify
 */
function requestJSON(fastify) {
  fastify.decorate('requestJSON', async (url, opts) => {
    const reqOpts = Object.assign({}, fastify.config.request, opts);
    const content = { 'Content-Type': 'application/json' };
    if (reqOpts.body && reqOpts.method.toLowerCase() === 'post') {
      /* Fetch needs the body to be stringified */
      reqOpts.body = JSON.stringify(reqOpts.body);
      if (!reqOpts.headers) {
        reqOpts.headers = content;
      }
      const hasContentType = Object.keys(reqOpts.headers).some(
        (header) => header === 'Content-Type'
      );
      if (!hasContentType) {
        reqOpts.headers = { ...reqOpts.headers, ...content };
      }
    }
    fastify.log.info(`${reqOpts.method} request to ${url}`);
    const response = await fetch(url, reqOpts);
    return response.json();
  });
}
/**
 * Function used to add the ISO timestamp to request logs
 *
 * @return     {string}  the String containing the timestamp
 */
function timestamp() {
  const d = new Date();
  const zone = d.getTimezoneOffset();
  let z = 'ART';
  if (zone !== 180) {
    z = d.getTimezoneOffset() / -60.0;
  }
  const date =
    weekDays[d.getDay()] +
    ' ' +
    months[d.getMonth()] +
    ' ' +
    zerofill(d.getHours()) +
    ':' +
    zerofill(d.getMinutes()) +
    ':' +
    zerofill(d.getSeconds()) +
    '.' +
    d.getMilliseconds() +
    ' ' +
    z +
    ' ' +
    d.getFullYear();
  return ',"time":"' + date + '"';
}

function zerofill(num) {
  if (num < 10) {
    num = '0' + num;
  }
  return num;
}

const generateNewPassword = (size = -8) => {
  return Math.random().toString(36).slice(size);
};
const encryptWord = async (word) => {
  const saltRounds = 10;
  return await bcrypt.hash(word, saltRounds);
};

function generateNewCode() {
  return Math.random().toString(36).substring(2, 7).toLowerCase();
}

module.exports = {
  corsHook,
  jwt,
  md5,
  errorHandler,
  request,
  requestJSON,
  ResponseError,
  genReqId,
  timestamp,
  logger,
  zerofill,
  openAPI,
  generateNewPassword,
  generateNewCode,
  encryptWord,
  mail,
};
