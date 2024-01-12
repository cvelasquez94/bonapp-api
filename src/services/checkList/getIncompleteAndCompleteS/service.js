const { Op } = require('sequelize')
module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance } = fastify.db

  async function getCheckList(roleId, userId) {
    console.log(userId)
    try {
      const checkList = await Checklist.findAll({
        where: { role_id: roleId},
        include: [
          {
            model: MainTask,
            as: 'mainTasks',
            required: true,
            include: [
              {
                model: SubTask,
                as: 'subTasks',
                required: true,
                include: [
                  {
                    // Incluye el modelo STaskInstance aquí
                    model: STaskInstance,
                    as: 'sTaskInstances',
                    where: {
                      user_id: userId,
                    },
                    required: false, // Esto hace que la inclusión sea una left outer join
                  },
                ],
              },
            ],
          },
        ],
      });

      const checklistsMap = checkList.map(checklist => {
        // Inicializar los arrays para subtasks completas e incompletas
        let subtasksComplete = [];
        let subtasksIncomplete = [];
      
        // Iterar sobre las mainTasks y sus subTasks
        checklist.mainTasks.forEach(mainTask => {
          mainTask.subTasks.forEach(subTask => {
            if (subTask.sTaskInstances && subTask.sTaskInstances.length > 0) {
              // La subTask está completa
              subtasksComplete.push(subTask);
            } else {
              // La subTask está incompleta
              subtasksIncomplete.push(subTask);
            }
          });
        });
      
        // Devolver un objeto con los datos de checklist y los arrays de subtasks
        return {
          id: checklist.id,
          name: checklist.name,
          desc: checklist.desc,
          subtasksComplete,
          subtasksIncomplete // ... otros datos de checklist que necesites ...
        };
      });
  
      if(!checklistsMap) {
        throw new Error('No checklist')
      }
      return checklistsMap
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getCheckList
  }
}