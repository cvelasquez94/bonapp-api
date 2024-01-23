module.exports = (fastify) => {
  const { Checklist, MainTask, SubTask, STaskInstance } = fastify.db;
  async function getSubTasks(roleid, branchid, limit, userId, checkListId) {
    try {
      const checkLists = await Checklist.findAll({
        where: { branch_id: branchid, role_id: roleid, id: checkListId},
        include: [
          {
            model: MainTask,
            as: 'mainTasks',
            include: [
              {
                model: SubTask,
                as: 'subTasks',
                include: [
                  {
                    // Incluye el modelo STaskInstance aquí
                    model: STaskInstance,
                    as: 'sTaskInstances',
                    where: {
                      user_id: userId, // Filtra por userId
                    },
                    required: false, // Esto hace que la inclusión sea una left outer join
                  },
                ],
              },
            ],
          },
        ],
      });
      console.log(JSON.stringify(checkLists));
      // Aplana los resultados para obtener solo subTasks
      let subTasks = [];
      checkLists.forEach((checklist) => {
        checklist.mainTasks.forEach((mainTask) => {
          mainTask.subTasks.forEach((subTask) => {
            // Aquí se accede a la propiedad status a través de la relación sTaskInstances
            subTask.dataValues.status =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].status
                : null;

            subTask.dataValues.comment =
              subTask.sTaskInstances?.length > 0
                ? subTask.sTaskInstances[0].comment
                : null;
                
            subTasks.push(subTask);
          });
        });
      });
      if (!subTasks) {
        throw new Error('No checklist');
      }

      // Ordena el array moviendo las tareas completadas al final
      subTasks.sort((a, b) => {
        if (
          a.dataValues.status === 'completed' &&
          b.dataValues.status !== 'completed'
        ) {
          return 1; // Mueve la tarea a hacia el final
        } else if (
          a.dataValues.status !== 'completed' &&
          b.dataValues.status === 'completed'
        ) {
          return -1; // Mantiene la tarea a antes que la tarea b
        }
        return 0; // No cambia el orden si ambas tienen el mismo estado
      });

      return subTasks;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getSubTasks,
  };
};
