module.exports = (fastify) => {
  const { Role } = fastify.db;

  async function updateRole(body) {
    try {

      const cb = await Role.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!cb){
        throw new Error('Role no existe');
      }

      let dataUpdate = {}
      if(body.name) dataUpdate.name = body.name
      if(body.enable === 0 || body.enable === 1) dataUpdate.enable = body.enable

      const cbu = await cb.update(dataUpdate)

      return cbu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateRole,
  };
};
