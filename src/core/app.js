'use strict';
const config = require('../../config/config');
const models = require('../models');
// const firebase = require('../firebase/firebase')
const { logger, ...utils } = require('../utils');
const fastify = require('fastify')({
  requestIdHeader: 'x-request-id',
  logger: { ...logger, ...config.pino },
});
async function app() {
  // await fastify.register(require('middie'))
  fastify.addHook('onRequest', utils.corsHook);
  fastify.decorate('config', config);
  fastify.decorate('db', models);
  fastify.setErrorHandler(utils.errorHandler);

  utils.jwt(fastify);
  utils.openAPI(fastify);
  utils.request(fastify);
  utils.requestJSON(fastify);

  fastify.register(require('../ping', { prefix: fastify.config.prefix }));
  console.log(fastify.config.prefix);
  fastify.register(require('../services/users/getUsers'), {
    prefix: fastify.config.prefix,
  });
  // fastify.register(require('../services/users/getBranchsUser'), {
  //   prefix: fastify.config.prefix,
  // });
  fastify.register(require('../services/users/getUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/users/createUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/users/updateUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/users/deleteUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/login/signIn'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/login/forgetPassword'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getCheckList'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getSubtasks'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/postSTaskInstance'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/auditReport'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getCheckListFilter'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getIncompleteAndCompleteS'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getStatisticsCheckList'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/documents/postImage'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/documents/deleteImage'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/notifications/getNotifications'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/notifications/createNotification'), {
    prefix: fastify.config.prefix,
  });
  fastify.ready((err) => {
    if (err) throw err;
  });

  return fastify;
}

module.exports = {
  app,
  logger: fastify.log,
};
