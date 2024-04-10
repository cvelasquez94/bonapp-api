module.exports = (fastify) => {
  const { SubTask } = fastify.db
  async function getSubTask(SubTask_id) {
    try {
      const queryConfig = {
        where: { id: SubTask_id},           
    };

    const SubTaskRet = await SubTask.unscoped().findAll(queryConfig);
      //console.log(SubTask)
      if(!SubTaskRet) {
        throw new Error('No SubTask')
      }
      return SubTaskRet
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getSubTask
  }
}
