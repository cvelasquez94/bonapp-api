module.exports = (fastify) => {
  const { ChecklistBranch } = fastify.db;

  async function deleteCheckBranch(body) {
    try {

      const cb = await ChecklistBranch.unscoped().findAll({
        where: { checklist_id: body.checklist_id, branch_id: body.branch_id },
      })

      if(!cb){
        throw new Error('ChecklistBranch no existe');
      }

      const resp = await ChecklistBranch.unscoped().update({ enable: 0}, {
        where: {
          checklist_id: body.checklist_id, branch_id: body.branch_id
        }
    });
        
      return resp


    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteCheckBranch,
  };
};
