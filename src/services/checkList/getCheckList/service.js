module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, ChecklistBranch } = fastify.db
  async function getCheckList(roleid, branchid, limit, status) {
    try {
      const queryConfig = {
        where: { role_id: roleid, enable: true},
        include: [{
            model: MainTask,
            as: 'mainTasks',
            include: [{
                model: SubTask,
                as: 'subTasks',
                ...(limit && { limit: limit })  // Incluye 'limit' solo si está definido
            }]
        },
        {
          model: ChecklistBranch.scope('defaultScope'),
          as: 'CheckListCheckBranch',
          required: true,
          where: { branch_id: branchid },
        },
      ]
    };

    const checkList = await Checklist.findAll(queryConfig);
      //console.log(checkList)
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
