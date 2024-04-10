module.exports = (fastify) => {
  const { Checklist } = fastify.db;

  async function updateChecklist(body) {
    try {

      const ch = await Checklist.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!ch){
        throw new Error('Checklist no existe');
      }

      let dataUpdate = {}
      if(body.enable) dataUpdate.enable = body.enable
      if(body.role_id) dataUpdate.role_id = body.role_id
      if(body.type) dataUpdate.type = body.type
      if(body.name) dataUpdate.name = body.name
      if(body.desc) dataUpdate.desc = body.desc
      if(body.schedule_start) dataUpdate.schedule_start = body.schedule_start
      if(body.schedule_end) dataUpdate.schedule_end = body.schedule_end

      const chu = await ch.update(dataUpdate)

      return chu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateChecklist,
  };
};
