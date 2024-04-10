module.exports = (fastify) => {
  const { MainTask, SubTask } = fastify.db
  async function getMainTask(mainTask_id) {
    try {
      const queryConfig = {
        where: { id: mainTask_id},
           include: [{
                model: SubTask.unscoped(),
                as: 'subTasks',
                required: false,
            }]
    };

    const MainTaskRet = await MainTask.unscoped().findAll(queryConfig);
      //console.log(MainTask)
      if(!MainTaskRet) {
        throw new Error('No MainTask')
      }
      return MainTaskRet
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getMainTask
  }
}
