module.exports = (fastify) => {
  const { ChecklistBranch } = fastify.db;

  async function updateCheckBranch(body) {
    try {

      const cb = await ChecklistBranch.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!cb){
        throw new Error('ChecklistBranch no existe');
      }

      let dataUpdate = {}
      if(body.enable === 0 || body.enable > 0) dataUpdate.enable = body.enable
      if(body.role_id) dataUpdate.role_id = body.role_id
      if(body.user_id) dataUpdate.user_id = body.user_id
      if(body.freqType) dataUpdate.freqType = body.freqType
      if(body.freqValue) dataUpdate.freqValue = body.freqValue
      if(body.start_date) dataUpdate.start_date = body.start_date
      if(body.end_date) dataUpdate.end_date = body.end_date
      if(body.flagRecurrent) dataUpdate.flagRecurrent = body.flagRecurrent
      if(body.monday) dataUpdate.monday = body.monday
      if(body.tuesday) dataUpdate.tuesday = body.tuesday
      if(body.wednesday) dataUpdate.wednesday = body.wednesday
      if(body.thursday) dataUpdate.thursday = body.thursday
      if(body.friday) dataUpdate.friday = body.friday
      if(body.saturday) dataUpdate.saturday = body.saturday
      if(body.sunday) dataUpdate.sunday = body.sunday

      const cbu = await cb.update(dataUpdate)

      return cbu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateCheckBranch,
  };
};
