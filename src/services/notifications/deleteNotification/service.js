module.exports = (fastify) => {
  const { Notification } = fastify.db;

  async function deleteNotification(body) {
    try {
      const noti = await Notification.findOne({
        where: { id: body.id },
      });

      if (!noti) {
        throw new Error('Notificacion no existe');
      }

      const resp = await Notification.delete();

      return resp;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteNotification,
  };
};
