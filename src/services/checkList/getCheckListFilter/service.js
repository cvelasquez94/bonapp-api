const { Op } = require('sequelize')
module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance } = fastify.db

  async function getCheckList(roleid, branchid, limit, status, userId) {
    try {
      let statusCondition = {};
      if (status === 'completed') {
        statusCondition = { status: 'completed' };
      } else if (status === undefined) {
        statusCondition = {};
      }
  
      const queryConfig = {
        where: { branch_id: branchid, role_id: roleid },
        include: [{
          model: MainTask,
          as: 'mainTasks',
          include: [{
            model: SubTask,
            as: 'subTasks',
            include: [{
              model: STaskInstance,
              as: 'sTaskInstances',
              where: {
                ...statusCondition,
                user_id: userId
              },
              required: status !== undefined // true si status está definido, de lo contrario false
            }],
            required: false // Esto asegura que subTasks se incluyan incluso si no hay una sTaskInstances correspondiente
          }]
        }]
      };
            
      const checkList = await Checklist.findAll(queryConfig);  
      
      // Iterar sobre cada mainTask y subTask para agregar el status
      checkList.forEach(checklistItem => {
        checklistItem.mainTasks.forEach(mainTask => {
          mainTask.subTasks.forEach(subTask => {
            // Encuentra el STaskInstance correspondiente
            const sTaskInstance = subTask.sTaskInstances.find(instance => instance.subTask_id === subTask.id);
            // Agrega el status a subTask
            if (sTaskInstance) {
              subTask.dataValues.status = sTaskInstance.status; // Usando dataValues para editar directamente el modelo
            } else {
              subTask.dataValues.status = 'not started'; // O cualquier valor por defecto que desees
            }
          });
        });
      });

      if(status === undefined) {
                // Convertir modelos Sequelize a un formato serializable
        const serializableCheckList = checkList.map(item => item.toJSON());

        // Filtrar para obtener solo los subTasks con status 'not started'
        const filteredCheckList = serializableCheckList.map(checklistItem => {
          const filteredMainTasks = checklistItem.mainTasks.map(mainTask => {
            const filteredSubTasks = mainTask.subTasks.filter(subTask => {
              const sTaskInstance = subTask.sTaskInstances.find(instance => instance.subTask_id === subTask.id);

              if (sTaskInstance) {
                return sTaskInstance.status === 'not started';
              } else {
                return true;
              }
            });

            return { ...mainTask, subTasks: filteredSubTasks };
          });

          return { ...checklistItem, mainTasks: filteredMainTasks };
        });

        return filteredCheckList;
      }
      if(!checkList) {
        throw new Error('No checklist')
      }
      return checkList
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getCheckList
  }
}