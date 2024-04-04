module.exports = (fastify) => {
  const { Notifications } = fastify.db;
  const { statusNotification } = require('../../../constants/statusConstants');

  async function createNotification(body) {
    try {
      const newNotification = {
        ...body,
        user_id: body.userId,
        status_id: statusNotification.SENT,
      };
      const result = await Notifications.create(newNotification);
      //end BD transaction
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createNotification,
  };
};
