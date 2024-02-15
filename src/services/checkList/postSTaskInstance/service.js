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
      
      let datapost = { dateTime };
      let dateTimeStr = '';
      
      //dateNow ahora viene del front dd-mm-yyyy
      if (dateNow) {
        dateTimeStr = dateNow
      console.log('dateNow: ', dateTimeStr);
      } else {
        //TODO quitar esto dsp de release apk
        now = new Date();
        const offset = 180 * 60000; //now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
        const localDateTime = new Date(now - offset); // Ajustar la hora al tiempo local
        console.log('localDateTime: ', localDateTime, ' offset: ', offset);
        dateTimeStr = `${localDateTime.getUTCDate().toString().padStart(2, '0')}-${(localDateTime.getUTCMonth()+1).toString().padStart(2, '0')}-${localDateTime.getUTCFullYear()}`;
      }

      console.log('dateTimeStr: ', dateTimeStr);

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

      if (status) datapost.status = status;
      if (comment) datapost.comment = comment;
      if (score >= 0) datapost.score = score;
      if (photo) datapost.photo = photo;

      // Decide si debes actualizar o crear un nuevo registro
      if (existingInstance) {
        // Si viene de auditoría y tiene score o comentario, actualiza

        if (score >= 0 || comment || status) {

          console.log('existingInstance.update', datapost);
          await existingInstance.update(datapost);
          return existingInstance;
        } else {
          // Si es checklist y no tiene score ni comentario, elimina          
          console.log('existingInstance.destroy', datapost);
          await existingInstance.destroy();
          return { dateTime: '', id: 0, status: '', subTask_id: 0, user_id: 0 };
        }
      }

      datapost.subTask_id = subTaskId;
      datapost.user_id = userId;
      console.log('datapost insert', datapost);

      const instance = await STaskInstance.create(datapost);
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
