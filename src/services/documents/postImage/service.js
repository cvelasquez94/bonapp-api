module.exports = (fastify) => {
    const { Document,STaskInstance } = fastify.db
    const { Op } = require('sequelize');
    async function postImage(data) {
      try {
      console.log(data)

      
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
                data.dateNow
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
  