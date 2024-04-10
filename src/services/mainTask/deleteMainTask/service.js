module.exports = (fastify) => {
  const { MainTask } = fastify.db;

  async function deleteMainTask(body) {
    try {

      const ch = await MainTask.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('MainTask no existe');
      }

      const resp = await MainTask.unscoped().update({ enable: 0}, {
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
    deleteMainTask,
  };
};
