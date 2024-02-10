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
      //dateNow ahora viene del front dd-mm-yyyy

      //TODO quitar esto dsp de release apk
      const tieneBarra = dateNow.indexOf('/');
      if(tieneBarra>0){
          let dateSplit = dateNow.split('/');
        if (dateSplit.length == 3) {
          dateTimeStr =
            dateSplit[0].padStart(2, '0') +
            '-' +
            dateSplit[1].padStart(2, '0') +
            '-' +
            dateSplit[2].padStart(4, '0');
          }
      }
      else{
        dateTimeStr = dateNow;
      }

      console.log('dateNow: ', dateTimeStr);

      let datapost = { dateTime };

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
