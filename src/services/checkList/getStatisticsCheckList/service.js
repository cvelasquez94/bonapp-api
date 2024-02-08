module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance } = fastify.db;
  const { Op } = require('sequelize');
  async function getstatisticsCheckList(userId, branchId, dateTime) {
    try {
      let dateTimeStr = '';
      let dateSplit = {};
      //TODO : en front al formatear string date ddMMyyyy
      if (dateTime) {
        dateSplit = dateTime.split('/');
        if (dateSplit.length == 3) {
          dateTimeStr =
            dateSplit[1].padStart(2, '0') + '-' + dateSplit[2].padStart(4, '0');
        }
      } else {
        const today = new Date();
        dateTimeStr = `${(today.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${today.getFullYear()} `;
      }

      console.log('str date', dateTimeStr);

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

      let sumTaskClose = 0;
      checkList.map((item) => {
        item.dataValues.mainTasks.map((item) => {
          sumTaskClose += item.dataValues.subTasks.length;
        });
      });

      
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

      let sumAuditClose = 0;

      checkAudit.map((item) => {
        sumAuditClose = item[0].countt;
      });

      
        return [
          {
            count: sumTaskClose,
            desc: `checklist finalizadas en ${dateTimeStr}`,
          },
          {
            count: sumAuditClose,
            desc: `auditoriías finalizadas en ${dateTimeStr}`,
          },
        ];
        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getstatisticsCheckList,
  };
};
