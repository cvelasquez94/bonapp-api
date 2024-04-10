module.exports = (fastify) => {
  const { SubTask } = fastify.db;

  async function deleteSubTask(body) {
    try {

      const ch = await SubTask.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('SubTask no existe');
      }

      const resp = await SubTask.unscoped().update({ enable: 0}, {
        where: {
          id: body.id
        }
    });
        
      return resp


    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteSubTask,
  };
};
