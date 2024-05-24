module.exports = (fastify) => {
    const { Notifications } = fastify.db;
    const { sendNotification } = require('../../notificationService');
    async function notificationTo(userInfo, jwt, checklistName, userFrom) {
      try {
        console.log('notificationTo', userInfo[0].dataValues, checklistName, userFrom, jwt);
        const { token, user_id } = userInfo[0].dataValues;
        await sendNotification({deviceToken: token, nameChecklist: checklistName, userId: user_id, jwt, userFrom})
        //console.log(data);
        // return data;
      } catch (error) {
        throw new Error(error);
      }
    }
  
    return {
        notificationTo,
    };
  };
  