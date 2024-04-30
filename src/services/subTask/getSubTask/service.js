module.exports = (fastify) => {
  const { SubTask } = fastify.db
  async function getSubTask(SubTask_id, page = 1, pageSize = 10) {
    let queryConfig;
    try {
      if (SubTask_id) {
        queryConfig = {
          where: { id: SubTask_id },
        };
      } else {
        const offset = (page - 1) * pageSize;
        queryConfig = {
          offset: offset,
          limit: pageSize
        };
      }

      const SubTaskRet = await SubTask.unscoped().findAll(queryConfig);
      if (!SubTaskRet) {
        throw new Error('No SubTask found');
      }
      return SubTaskRet;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getSubTask
  }
}
