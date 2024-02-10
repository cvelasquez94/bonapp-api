module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance, Role, RoleUser } = fastify.db;
  const { Op } = require('sequelize');
  async function getstatisticsCheckList(userId, branchId, dateNow) {
    try {
      let dateTimeStr = '';
      //dateNow ahora viene del front dd-mm-yyyy
      if (dateNow) {
        dateTimeStr = dateNow.substr(dateNow.indexOf('-')+1)
      } else {
        //TODO quitar esto dsp de release apk
        now = new Date();
        const offset = now.getTimezoneOffset() * 60000; // Obtener el desplazamiento de la zona horaria en milisegundos
        const localDateTime = new Date(now - offset); // Ajustar la hora al tiempo local
        console.log(localDateTime)
        dateTimeStr = `${(localDateTime.getMonth()+1).toString().padStart(2, '0')}-${localDateTime.getFullYear()}`;
      }

      console.log('dateNow: ', dateTimeStr);

      const checkTypes = await Checklist.findAll({
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
              },
            ],
          },
        ],
      });


      const flagAudit = checkTypes.some((item) => {
           {return item.dataValues.type === 'audit';}
      });

      console.log(flagAudit)

      const flagCheck = checkTypes.some((item) => {
        {return item.dataValues.type === 'checklist';}
      });

      console.log(flagCheck)


   let sumTaskClose=-1
   let sumAuditClose=-1
   let arrRet=[]

   if(flagCheck){

      const checkList = await Checklist.findAll({
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
                      comment: 'finalized',
                      [Op.and]: [
                        { user_id: userId },
                        STaskInstance.sequelize.where(
                          STaskInstance.sequelize.fn(
                            'DATE_FORMAT',
                            STaskInstance.sequelize.col('dateTime'),
                            '%m-%Y'
                          ),
                          dateTimeStr
                        ),
                      ],
                    },
                    required: true,
                  },
                ],
              },
            ],
          },
        ],
        where: { branch_id: branchId, enable: true },
      });

      sumTaskClose = 0;
      checkList.map((item) => {
        item.dataValues.mainTasks.map((item) => {
          sumTaskClose += item.dataValues.subTasks.length;
        });
      });

      arrRet=[...arrRet, {
        count: sumTaskClose,
        desc: `checklists finalizadas.`,
      },]
    }

    if(flagAudit){
      
      const checkAudit = await Checklist.sequelize.query(
        "SELECT COUNT(DISTINCT CONCAT(`Checklist`.`id`,DATE_FORMAT(`dateTime`, '%d-%m-%Y'))) as countt " +
        " FROM  `Checklists` AS `Checklist` INNER JOIN `MainTasks` AS `mainTasks` ON `Checklist`.`id` = `mainTasks`.`checkList_id`  " +
        " INNER JOIN `SubTasks` AS `mainTasks->subTasks` ON `mainTasks`.`id` = `mainTasks->subTasks`.`mainTask_id`  " +
        " INNER JOIN `STaskInstances` AS `mainTasks->subTasks->sTaskInstances` ON `mainTasks->subTasks`.`id` = `mainTasks->subTasks->sTaskInstances`.`subTask_id`  " +
        " AND (`mainTasks->subTasks->sTaskInstances`.`user_id` = :user AND DATE_FORMAT(`dateTime`, '%m-%Y') = '"+dateTimeStr+"')  " +
        " AND `mainTasks->subTasks->sTaskInstances`.`status` = 'audited'  " +
        " WHERE `Checklist`.`branch_id` = :branch AND `Checklist`.`enable` = true;",
        {
          replacements: { user: userId, branch: branchId},
        },
        {type: Checklist.sequelize.QueryTypes.SELECT}
      );

      console.log('aud'+JSON.stringify(checkAudit))

      sumAuditClose = 0;

      checkAudit.map((item) => {
        sumAuditClose = item[0].countt;
      });

      arrRet=[...arrRet, {
        count: sumAuditClose,
        desc: `auditorías finalizadas.`,
      },]
    }

    return arrRet

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getstatisticsCheckList,
  };
};