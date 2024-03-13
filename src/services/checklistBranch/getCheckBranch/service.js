module.exports = (fastify) => {
  const { ChecklistBranch } = fastify.db;

  async function getCheckBranch(body) {
    try {
      let query = {};

      if (body.checklist_id) query.checklist_id = body.checklist_id;
      if (body.branch_id) query.branch_id = body.branch_id;

      const cb = await ChecklistBranch.unscoped().findAll({
          where: query,
        })
      

      if(!cb){
        throw new Error('ChecklistBranch no existe');
      }

      return cb;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCheckBranch,
  };
};
