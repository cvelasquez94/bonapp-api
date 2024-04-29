module.exports = (fastify) => {
  const { Role } = fastify.db;

  async function deleteRole(body) {
    try {

      const ch = await Role.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('Role no existe');
      }


      const resp = await Role.unscoped().update({ enable: 0 }, {
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
    deleteRole,
  };
};
