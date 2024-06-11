module.exports = (fastify) => {
  const {
    Checklist,
    MainTask,
    SubTask,
    STaskInstance,
    RoleUser,
    Role,
    ChecklistBranch,
  } = fastify.db;
  const { Op } = require('sequelize');
  async function getCheckList(roleId, userId, branchId, dateNow) {
    try {
      let dateTimeStr = '';
      //dateNow ahora viene del front dd-mm-yyyy

      //TODO quitar esto dsp de release apk
      const tieneBarra = dateNow.indexOf('/');
      if (tieneBarra > 0) {
        let dateSplit = dateNow.split('/');
        if (dateSplit.length == 3) {
          dateTimeStr =
            dateSplit[0].padStart(2, '0') +
            '-' +
            dateSplit[1].padStart(2, '0') +
            '-' +
            dateSplit[2].padStart(4, '0');
        }
      } else {
        dateTimeStr = dateNow;
      }

      // console.log('--------------dateNow: ', dateTimeStr);

      let checkList = [];

      await Promise.all([
        await Checklist.findAll({
          include: [
            {
              model: ChecklistBranch.scope('dateNow', {method: ['dateNow', dateTimeStr]}),
              as: 'ChecklistBranch',
              required: true,
              where: { branch_id: branchId },
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
                ],
            },
            {
              model: MainTask.scope('defaultScope'),
              as: 'mainTasks',
              required: true,
              include: [
                {
                  model: SubTask.scope('defaultScope'),
                  as: 'subTasks',
                  required: true,
                  include: [
                    {
                      model: STaskInstance,
                      as: 'sTaskInstances',
                      where: {
                        [Op.and]: [
                          { user_id: userId, branch_id: branchId },
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
          order: [
            [Checklist.sequelize.col('id'), 'ASC'],
            [SubTask.sequelize.col('mainTasks.orden'), 'ASC'],
            [SubTask.sequelize.col('mainTasks.subTasks.orden'), 'ASC'],
          ],
        }),
        await Checklist.findAll({
          include: [
            {
              model: ChecklistBranch.scope('dateNow', {method: ['dateNow', dateTimeStr]}),
              as: 'ChecklistBranch',
              required: true,
              where: { branch_id: branchId, user_id: userId },
            },
            {
              model: MainTask.scope('defaultScope'),
              as: 'mainTasks',
              required: true,
              include: [
                {
                  model: SubTask.scope('defaultScope'),
                  as: 'subTasks',
                  required: true,
                  include: [
                    {
                      model: STaskInstance,
                      as: 'sTaskInstances',
                      where: {
                        [Op.and]: [
                          { user_id: userId, branch_id: branchId },
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
          order: [
            [Checklist.sequelize.col('id'), 'ASC'],
            [SubTask.sequelize.col('mainTasks.orden'), 'ASC'],
            [SubTask.sequelize.col('mainTasks.subTasks.orden'), 'ASC'],
          ],
        })
    ]).then((response) => {
      const checkRole = response[0]; //query igual a original que trae todas las checklists segun roles del usuario
      const checkUser = response[1]; //filtro para checks particular por usuario
      checkRole.forEach((obj) => {
          let objData = obj.get();  
          checkList.push(objData);
        });
      checkUser.forEach((obj) => {
          let objData = obj.get();
          checkList.push(objData);
        });
      }) 
    .catch((error) => {
        console.log(error);
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
                (item) => item.dataValues.status === 'finalized'
              );
            if (!isFinalized)
              isFinalized = subTask.dataValues.sTaskInstances.some(
                (item) => item.dataValues.status === 'audited'
              );
            
            if(check.type === 'audit'){

              if (subTask.sTaskInstances && subTask.sTaskInstances.length > 0 ) {
                // La subTask está completa
                subtasksComplete.push(subTask);
              } else {
                // La subTask está incompleta
                subtasksIncomplete.push(subTask);
              }

            }
            else //para checks y ToDo
            { 
                if (subTask.sTaskInstances && subTask.sTaskInstances.length > 0 ) {
                  if(subTask.sTaskInstances.some(
                    (item) => item.dataValues.status === 'finalized' || item.dataValues.status === 'completed'
                  )){
                  // La subTask está completa
                  subtasksComplete.push(subTask);
                  }else {
                    // La subTask está incompleta - checklist puede tener comentario o fotos sin estar completa
                    subtasksIncomplete.push(subTask);
                  }
                } else {
                  // La subTask está incompleta
                  subtasksIncomplete.push(subTask);
                }
            }
          });
        });
           

        // Devolver un objeto con los datos de check y los arrays de subtasks
        return {
          id: check.id,
          role_id: check.ChecklistBranch[0].role_id,
          user_id: check.ChecklistBranch[0].user_id,
          name: check.name,
          desc: check.desc,
          type: check.type,
          isFinalized: isFinalized,
          schedule_start: check.ChecklistBranch[0].start_date,
          schedule_end: check.ChecklistBranch[0].end_date,
          subtasksComplete,
          subtasksIncomplete, // ... otros datos de checklist que necesites ...
        };
      });

      if (!checklistsMap.length) {
        console.error(
          'No exiten checklist ==> ',
          dateTimeStr,
          userId,
          branchId
        );
      }

      //reduce dejando el checkId del segundo array, que es por checklists para user_id especifico
      const op = checklistsMap.reduce((op,inp)=>{
        op[inp.id] = inp
        return op
      },{})

      return Object.values(op);
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCheckList,
  };
};
