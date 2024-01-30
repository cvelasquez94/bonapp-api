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

      if (checkList.length) {
        return [
          {
            id: checkList.length,
            desc: 'checklist finalizadas',
          },
        ];
      }
      return [];
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getstatisticsCheckList,
  };
};
