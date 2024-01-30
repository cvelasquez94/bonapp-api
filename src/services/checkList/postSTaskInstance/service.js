const {} = require('../../../models');
const { Op } = require('sequelize');

module.exports = (fastify) => {
  const { STaskInstance } = fastify.db;
  async function createSTaskInstance({
    subTaskId,
    userId,
    status,
    dateTime,
    comment,
    score,
    photo,
    dateNow,
  }) {
    try {
      let dateTimeStr = '';
      let dateSplit = {};
      //TODO : en front al formatear string date ddMMyyyy
      if (dateTime) {
        dateSplit = dateTime.split('/');
      }
      if (dateSplit.length == 3) {
        dateTimeStr =
          dateSplit[0].padStart(2, '0') +
          '-' +
          dateSplit[1].padStart(2, '0') +
          '-' +
          dateSplit[2].padStart(4, '0');
      }
      //console.log('str',dateTimeStr)

      // Busca un registro existente
      const existingInstance = await STaskInstance.findOne({
        where: {
          [Op.and]: [
            { subTask_id: subTaskId, user_id: userId },
            STaskInstance.sequelize.where(
              STaskInstance.sequelize.fn(
                'DATE_FORMAT',
                STaskInstance.sequelize.col('dateTime'),
                '%d-%m-%Y'
              ),
              dateTimeStr
            ),
          ],
        },
      });

      // Decide si debes actualizar o crear un nuevo registro
      if (existingInstance) {
        // Si viene de auditoría y tiene score o comentario, actualiza
        if (score || comment) {
          await existingInstance.update({
            status,
            dateTime,
            comment,
            score,
            photo,
          });
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
        photo,
      });
      if (!instance) {
        throw new Error('No se puedo crear la instancia');
      }
      return instance;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createSTaskInstance,
  };
};
