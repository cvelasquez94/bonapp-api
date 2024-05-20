module.exports = (fastify) => {
  const { Notifications } = fastify.db;

  async function getNotifications(user_id) {
    try {
      const data = await Notifications.findAll({
         where: { user_id },
         order: [[ 'sentTime', 'DESC']] });
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
    getNotifications,
  };
};
