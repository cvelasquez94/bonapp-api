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
  // require('../cron/scheduleCron');
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
  fastify.register(require('../services/users/getBranchsUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/users/getUsersByBranch'), {
    prefix: fastify.config.prefix,
  });
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
  fastify.register(require('../services/checkList/getChecklistAll'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/createChecklist'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/deleteChecklist'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/updateChecklist'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getCheckList'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getCheckListByID'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getSubtasks'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/postSTaskInstance'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checkList/getCheckListDue'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checklistBranch/getCheckBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checklistBranch/createCheckBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checklistBranch/updateCheckBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/checklistBranch/deleteCheckBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/mainTask/createMainTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/mainTask/deleteMainTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/mainTask/updateMainTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/mainTask/getMainTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/subTask/createSubTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/subTask/deleteSubTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/subTask/updateSubTask'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/subTask/getSubTask'), {
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
  fastify.register(require('../services/notifications/updateNotification'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/tokenUser/getTokenUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/tokenUser/createTokenUser'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/files/getFiles'), {
    prefix: fastify.config.prefix
  });
  fastify.register(require('../services/branch/createBranch'), {
    prefix: fastify.config.prefix,
  });
    fastify.register(require('../services/branch/getBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/branch/deleteBranch'), {
    prefix: fastify.config.prefix,
  });
  fastify.register(require('../services/branch/updateBranch'), {
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
