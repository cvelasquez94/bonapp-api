module.exports = (fastify) => {
  const { ChecklistBranch } = fastify.db;

  async function createCheckBranch(body) {
    try {

      if (body.role_id>0 && body.user_id>0) {
        throw new Error('Solo uno de las dos configs es soportada a la vez: o role_id, o user_id');
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

      const existInstance = await ChecklistBranch.unscoped().findOne({
        where: whereCond
      });

      if(existInstance)
      {
        throw new Error('ChecklistBranch ya configurada para check+branch+role/user, con id: '+existInstance.id);
      }

      let cbObj = {
        checklist_id: body.checklist_id,
        branch_id: body.branch_id,
        role_id: body.role_id,
        user_id: body.user_id,
        start_date: body.start_date,
        end_date: body.end_date,
        enable: body.enable == null? 1 : body.enable,
        freqType: body.freqType,
        freqValue: body.freqValue,
        flagRecurrent: body.flagRecurrent,
        monday: body.monday,
        tuesday: body.tuesday,
        wednesday: body.wednesday,
        thursday: body.thursday,
        friday: body.friday,
        saturday: body.saturday,
        sunday: body.sunday,
      }

        
        const cbRet = await ChecklistBranch.create(cbObj);

        return cbRet;
        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createCheckBranch,
  };
};
