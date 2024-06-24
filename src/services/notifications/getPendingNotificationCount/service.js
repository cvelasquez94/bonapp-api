module.exports = (fastify) => {
  const { Notifications } = fastify.db;

  async function getPendingNotificationCount(user_id) {
    try {
      const data = await Notifications.count({
         where: { user_id: user_id, read: 0 },
        });
      if (!data) {
        throw new Error('Notificaciones no encontrados');
      }
      //console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getPendingNotificationCount,
  };
};
