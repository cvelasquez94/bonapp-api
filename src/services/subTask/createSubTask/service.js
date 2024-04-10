module.exports = (fastify) => {
  const { SubTask } = fastify.db;

  async function createSubTask(body) {
    try {

      
      let stObj = {
        mainTask_id: body.mainTask_id,
        name: body.name,
        enable: body.enable == null? 1 : body.enable,
        orden: body.orden,
        desc: body.desc? body.desc : body.name,
        expiration: body.expiration,
        scoreMultiplier: body.scoreMultiplier,
      }

      if(body.id)
      {
        stObj = { ...stObj, id: body.id}
      }

  
      const subRet = await SubTask.create(stObj);

      return subRet;
        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createSubTask,
  };
};
