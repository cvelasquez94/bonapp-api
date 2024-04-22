module.exports = (fastify) => {
  const { Notifications } = fastify.db;

  async function updateNotification(body) {
    try {
      const existsNoti = await Notifications.findOne({
        where: { id: body.id },
      });
      if (!existsNoti) {
        throw new Error('Notificacion no encontrados');
      }
      await existsNoti.update({ read: body.read });
      //end BD transaction
      return existsNoti;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateNotification,
  };
};
