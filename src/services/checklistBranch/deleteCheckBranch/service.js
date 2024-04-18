module.exports = (fastify) => {
  const { ChecklistBranch } = fastify.db;

  async function deleteCheckBranch(body) {
    try {

      if (!body.role_id && !body.user_id) {
        throw new Error('Uno de las dos configs es requerida: o role_id, o user_id');
      }

      let whereCond= {
        checklist_id: body.checklist_id,
        branch_id: body.branch_id,};

      if (body.role_id>0) {
        whereCond = { ...whereCond, role_id: body.role_id};
      }
      if (body.user_id>0) {
        whereCond = { ...whereCond, user_id: body.user_id};
      }

      const existInstance = await ChecklistBranch.unscoped().findAll({
        where: whereCond
      });

      // const cb = await ChecklistBranch.unscoped().findAll({
      //   where: { checklist_id: body.checklist_id, branch_id: body.branch_id },
      // })
      
      if(existInstance.length === 0){
        throw new Error('ChecklistBranch no existe');
      }

      const resp = await ChecklistBranch.unscoped().update({ enable: 0 }, {
        where: whereCond
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
