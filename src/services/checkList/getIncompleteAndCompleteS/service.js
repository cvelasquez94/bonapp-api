module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance, RoleUser, Role } =
    fastify.db;
  const { Op } = require('sequelize');
  async function getCheckList(roleId, userId, branchId, dateNow) {
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


      const checkList = await Checklist.findAll({
        where: { branch_id: branchId, enable: true },
        include: [
          {
            model: Role,
            as: 'role',
            required: true,
            include: [
              {
                model: RoleUser,
                as: 'roleUser',
                required: true,
                where: { user_id: userId },
              },
            ],
          },
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
                          STaskInstance.sequelize.fn(
                            'DATE_FORMAT',
                            STaskInstance.sequelize.col('dateTime'),
                            '%d-%m-%Y'
                          ),
                          dateTimeStr
                        ),
                      ],
                    },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      });

      const checklistsMap = checkList.map((check) => {
        // Inicializar los arrays para subtasks completas e incompletas
        // console.log(check, ' ------------ ');
        let isFinalized = false;
        let subtasksComplete = [];
        let subtasksIncomplete = [];

        // Iterar sobre las mainTasks y sus subTasks
        check.mainTasks.forEach((mainTask) => {
          mainTask.subTasks.forEach((subTask) => {
            if (!isFinalized)
              isFinalized = subTask.dataValues.sTaskInstances.some(
                (item) => item.dataValues.comment === 'finalized'
              );
            if (!isFinalized)
              isFinalized = subTask.dataValues.sTaskInstances.some(
                (item) => item.dataValues.status === 'audited'
              );  

            if (subTask.sTaskInstances && subTask.sTaskInstances.length > 0) {
              // La subTask está completa
              subtasksComplete.push(subTask);
            } else {
              // La subTask está incompleta
              subtasksIncomplete.push(subTask);
            }
          });
        })
        
        /*if (
          check.dataValues.type === 'audit'
           )*/

        // Devolver un objeto con los datos de check y los arrays de subtasks
        return {
          id: check.id,
          role_id: check.role_id,
          name: check.name,
          desc: check.desc,
          type: check.type,
          isFinalized: isFinalized,
          schedule_start: check.schedule_start,
          subtasksComplete,
          subtasksIncomplete, // ... otros datos de checklist que necesites ...
        };
      });

      if (!checklistsMap) {
        throw new Error('No checklist');
      }
      return checklistsMap;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCheckList,
  };
};
