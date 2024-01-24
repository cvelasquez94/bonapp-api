module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance } = fastify.db
  const { Op } = require("sequelize");
  async function getCheckList(roleId, userId, branchId, dateTime) {
    try {
      var dateTimeStr = ''
      var dateSplit = {};
      //TODO : en front al formatear string date ddMMyyyy
      if(dateTime){
        dateSplit = dateTime.split('-')
      }
      if (dateSplit.length == 3) {
        dateTimeStr = dateSplit[0].padStart(2, "0")+"-"+dateSplit[1].padStart(2, "0")+"-"+dateSplit[2].padStart(4, "0")
      }
      //console.log('str',dateTimeStr)
      
      const checkList = await Checklist.findAll({
        where: { role_id: roleId, branch_id: branchId, enable: true},
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
                    model: STaskInstance,
                    as: 'sTaskInstances',
                    where: {
                      [Op.and]: [
                        { user_id: userId },
                        STaskInstance.sequelize.where(
                                STaskInstance.sequelize.fn('DATE_FORMAT', STaskInstance.sequelize.col('dateTime')
                                                          ,'%d-%m-%Y'),
                                                      dateTimeStr),
                      ]
                    },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      const checklistsMap = checkList.map(check => {
        // Inicializar los arrays para subtasks completas e incompletas
        let subtasksComplete = [];
        let subtasksIncomplete = [];
      
        // Iterar sobre las mainTasks y sus subTasks
        check.mainTasks.forEach(mainTask => {
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
      
        // Devolver un objeto con los datos de check y los arrays de subtasks
        return {
          id: check.id,
          name: check.name,
          desc: check.desc,
          type: check.type,
          schedule_start: check.schedule_start,
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