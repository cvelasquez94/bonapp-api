module.exports = (fastify) => {
  const { Notifications } = fastify.db;

  async function getNotifications() {
    try {
      const data = Notifications.findAll();
      if (!data) {
        throw new Error('Notificaciones no encontrados');
      }
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getNotifications,
  };
};
