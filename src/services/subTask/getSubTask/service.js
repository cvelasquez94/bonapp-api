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

      const { count, rows} = await SubTask.unscoped().findAndCountAll(queryConfig);
      if (rows.length === 0) {
        throw new Error('No SubTask found');
      }
      return {
        subTasks: rows,
        totalItems: count,
        totalPages: Math.ceil(count / pageSize),
        currentPage: page     
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getSubTask
  }
}
