module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, ChecklistBranch } = fastify.db
  async function getCheckList(roleid, branchid, limit, status) {
    try {
      const queryConfig = {
        where: { enable: true},
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
          model: ChecklistBranch.unscoped(),
          as: 'ChecklistBranch',
          required: true,
          where: { branch_id: branchid, role_id: roleid },
        },
      ]
    };

    const checkList = await Checklist.findAll(queryConfig);
      //console.log(checkList)

    if(!checkList) {
        throw new Error('No checklist')
      }

      const checklistsMap = checkList.map((check) => {
        
        return {
          id: check.id,
          role_id: check.ChecklistBranch[0].role_id,
          user_id: check.ChecklistBranch[0].user_id,
          name: check.name,
          desc: check.desc,
          type: check.type,
          schedule_start: check.ChecklistBranch[0].start_date,
          schedule_end: check.ChecklistBranch[0].end_date,
          enable: check.enable,
          branch_id: check.ChecklistBranch[0].branch_id,
          createdAt: check.createdAt,
          updatedAt: check.updatedAt,
        };
      });

      return checklistsMap
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getCheckList
  }
}
