module.exports = (fastify) => {
    const { Document,STaskInstance } = fastify.db
    const { Op } = require('sequelize');
    async function postImage(data) {
      try {
        console.log(data)

      let dateTimeStr = '';
      let dateSplit = {};
      //TODO : en front al formatear string date ddMMyyyy
      if (data.dateTime) {
        dateSplit = data.dateTime.split('/');
      }
      if (dateSplit.length == 3) {
        dateTimeStr =
          dateSplit[0].padStart(2, '0') +
          '-' +
          dateSplit[1].padStart(2, '0') +
          '-' +
          dateSplit[2].padStart(4, '0');
      }
        
        const existingInstance = await STaskInstance.findOne({
          where: {
            [Op.and]: [
              { subTask_id: data.staskInstance_id, user_id: data.user_id },
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

        console.log('instance: '+ JSON.stringify(existingInstance));
        
        if(!existingInstance) {
          throw new Error('STInstance not found')
        }

        data.staskInstance_id = existingInstance.dataValues.id;

        
        const document = Document.create(data)

        if(!document) {
          throw new Error('Document fail')
        }
        return document
      } catch (error) {
        throw new Error(error)
      }
    }
  
    return {
      postImage
    }
  }
  