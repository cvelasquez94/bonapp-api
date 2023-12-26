module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask } = fastify.db
  async function getCheckList(roleid, branchid, limit) {
    try {
      const checkList = await Checklist.findAll({
        where: { branch_id: branchid, role_id: roleid },
        include: [{
          model: MainTask,
          as: 'mainTasks',
          include: [{
            limit: limit,
            model: SubTask,
            as: 'subTasks'
          }]
        }]
      })
      console.log(checkList)
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
