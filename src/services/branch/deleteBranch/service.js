module.exports = (fastify) => {
  const { Branches } = fastify.db;

  async function deleteBranch(body) {
    try {

      const ch = await Branches.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('Branch no existe');
      }


      const resp = await Branches.unscoped().update({ enable: 0}, {
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
    deleteBranch,
  };
};
