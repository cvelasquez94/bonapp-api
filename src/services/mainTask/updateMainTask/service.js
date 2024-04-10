module.exports = (fastify) => {
  const { MainTask } = fastify.db;

  async function updateMainTask(body) {
    try {

      const mt = await MainTask.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!mt){
        throw new Error('MainTask no existe');
      }

      let dataUpdate = {}
      if(body.enable) dataUpdate.enable = body.enable
      if(body.orden) dataUpdate.orden = body.orden
      if(body.name) dataUpdate.name = body.name
      if(body.desc) dataUpdate.desc = body.desc
      if(body.schedule_start) dataUpdate.schedule_start = body.schedule_start
      if(body.schedule_end) dataUpdate.schedule_end = body.schedule_end

      const mtu = await mt.update(dataUpdate)

      return mtu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateMainTask,
  };
};
