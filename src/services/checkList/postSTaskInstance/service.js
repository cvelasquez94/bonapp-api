const {  } = require('../../../models')

module.exports = (fastify) => {
  const { STaskInstance } = fastify.db
  async function createSTaskInstance({ subTaskId, userId, status, dateTime, comment, score, photo }) {
    try {

      // Busca un registro existente
      const existingInstance = await STaskInstance.findOne({
        where: {
          subTask_id: subTaskId,
          user_id: userId
        }
      });

      // Decide si debes actualizar o crear un nuevo registro
      if (existingInstance) {
        // Si viene de auditoría y tiene score o comentario, actualiza
        if (score || comment) {
          await existingInstance.update({ status, dateTime, comment, score, photo });
          return existingInstance;
        } else {
          // Si es checklist y no tiene score ni comentario, elimina
          await existingInstance.destroy();
          return { dateTime: '', id: 0, status: '', subTask_id: 0, user_id: 0 };
        }
      }
      
      const instance = await STaskInstance.create({
        subTask_id: subTaskId,
        user_id: userId,
        status: status,
        dateTime,
        comment,
        score,
        photo
      });
      if(!instance) {
        throw new Error('No se puedo crear la instancia')
      }
      return instance
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    createSTaskInstance
  }
}
