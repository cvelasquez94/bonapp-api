module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, ChecklistBranch } = fastify.db
  async function getCheckListByID(checkID) {
    try {
      const queryConfig = {
        where: { id: checkID },
        include: [{
            model: MainTask.unscoped(),
            as: 'mainTasks',
            include: [{
                model: SubTask.unscoped(),
                as: 'subTasks',
            }]
        },
        {
          model: ChecklistBranch.unscoped(),
          as: 'ChecklistBranch',
          required: false,
        },
      ]
    };

    const checkList = await Checklist.unscoped().findAll(queryConfig);
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
    getCheckListByID
  }
}
