module.exports = (fastify) => {
  const { Checklist } = fastify.db;

  async function deleteChecklist(body) {
    try {

      const ch = await Checklist.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('Checklist no existe');
      }

      const resp = await Checklist.unscoped().update({ enable: 0}, {
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
    deleteChecklist,
  };
};
