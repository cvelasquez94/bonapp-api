module.exports = (fastify) => {
  const { SubTask } = fastify.db;

  async function updateSubTask(body) {
    try {

      const st = await SubTask.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!st){
        throw new Error('SubTask no existe');
      }

      let dataUpdate = {}
      if(body.enable === 0 || body.enable > 0) dataUpdate.enable = body.enable
      if(body.orden) dataUpdate.orden = body.orden
      if(body.scoreMultiplier) dataUpdate.scoreMultiplier = body.scoreMultiplier
      if(body.name) dataUpdate.name = body.name
      if(body.desc) dataUpdate.desc = body.desc
      if(body.expiration) dataUpdate.expiration = body.expiration

      const stu = await st.update(dataUpdate)

      return stu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateSubTask,
  };
};
