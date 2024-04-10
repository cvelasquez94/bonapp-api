module.exports = (fastify) => {
  const { MainTask, SubTask } = fastify.db;

  async function createMainTask(body) {
    try {

      now = new Date();
      const localDateTime = now.setHours(0,0,0,0); // last midnight
      
      let mtObj = {
        checkList_id: body.checkList_id,
        name: body.name,
        enable: body.enable == null? 1 : body.enable,
        orden: body.orden,
        desc: body.desc? body.desc : body.name,
        schedule_start: body.schedule_start? body.schedule_start : localDateTime,
        schedule_end: body.end_date,
        subTasks: body.subTasks? body.subTasks : [],
      }

      if(body.id)
      {
        mtObj = { ...mtObj, id: body.id}
      }

  

      const result = await MainTask.sequelize.transaction(async (t) => {
        
        const mtRet = await MainTask.create(mtObj, { transaction: t });

          for (subTask of mtObj.subTasks) {
            let sobj = {
              //mainTask_id: subTask.mainTask_id,
              name: subTask.name,
              desc: subTask.desc? subTask.desc : subTask.name,
              expiration: subTask.expiration,
              scoreMultiplier: subTask.scoreMultiplier,
              enable: subTask.enable == null? 1 : subTask.enable,
              orden: subTask.orden
            }
            
            sobj = {...sobj, mainTask_id: mtRet.id}

            const subRet = await SubTask.create(sobj, { transaction: t });
  
          }



        return mtRet;

      }); //end BD transaction

      return result;
        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createMainTask,
  };
};
