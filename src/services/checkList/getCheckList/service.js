module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask } = fastify.db
  async function getCheckList(roleid, branchid, limit) {
    try {
      const queryConfig = {
        where: { branch_id: branchid, role_id: roleid },
        include: [{
            model: MainTask,
            as: 'mainTasks',
            include: [{
                model: SubTask,
                as: 'subTasks',
                ...(limit && { limit: limit })  // Incluye 'limit' solo si está definido
            }]
        }]
    };

    const checkList = await Checklist.findAll(queryConfig);
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
