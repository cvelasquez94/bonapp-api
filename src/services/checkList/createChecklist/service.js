module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask } = fastify.db;

  async function createChecklist(body) {
    try {

      now = new Date();
      const localDateTime = now.setHours(0,0,0,0); // last midnight
      
      let chObj = {
        role_id: body.role_id,
        name: body.name,
        type: body.type,
        enable: body.enable == null? 1 : body.enable,
        desc: body.desc? body.desc : body.name,
        schedule_start: body.schedule_start? body.schedule_start : localDateTime,
        schedule_end: body.end_date,
        mainTasks: body.mainTasks,
      }

      if(body.id)
      {
        chObj = { ...chObj, id: body.id}
      }

  

      const result = await Checklist.sequelize.transaction(async (t) => {
        
        const chRet = await Checklist.create(chObj, { transaction: t });

        for (mainTask of chObj.mainTasks) {
          let mobj = {
            //checkList_id: chObj.checkList_id,
            name: mainTask.name,
            desc: mainTask.desc? mainTask.desc : mainTask.name,
            schedule_start: mainTask.schedule_start? mainTask.schedule_start : localDateTime,
            schedule_end: mainTask.end_date,
            enable: mainTask.enable == null? 1 : mainTask.enable,
            orden: mainTask.orden
          }
          
          mobj = {...mobj, checkList_id: chRet.id}
          
          const mainRet = await MainTask.create(mobj, { transaction: t });

          for (subTask of mainTask.subTasks) {
            let sobj = {
              //mainTask_id: subTask.mainTask_id,
              name: subTask.name,
              desc: subTask.desc? subTask.desc : subTask.name,
              expiration: subTask.expiration,
              scoreMultiplier: subTask.scoreMultiplier,
              enable: subTask.enable == null? 1 : subTask.enable,
              orden: subTask.orden
            }
            
            sobj = {...sobj, mainTask_id: mainRet.id}

            const subRet = await SubTask.create(sobj, { transaction: t });
  
          }

        }


        return chRet;

      }); //end BD transaction

      return result;
        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createChecklist,
  };
};
