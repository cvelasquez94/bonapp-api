module.exports = (fastify) => {
  const { Branches } = fastify.db;

  async function updateBranch(body) {
    try {

      const cb = await Branches.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!cb){
        throw new Error('Branch no existe');
      }

      let dataUpdate = {}
      if(body.name) dataUpdate.name = body.name
      if(body.short_name) dataUpdate.short_name = body.short_name
      if(body.address) dataUpdate.address = body.address
      if(body.rut) dataUpdate.rut = body.rut
      if(body.patent_url) dataUpdate.patent_url = body.patent_url
      if(body.restaurant_id) dataUpdate.restaurant_id = body.restaurant_id
      if(body.enable === 0 || body.enable === 1) dataUpdate.enable = body.enable

      const cbu = await cb.update(dataUpdate)

      return cbu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateBranch,
  };
};
