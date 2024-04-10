module.exports = (fastify) => {
  const { Checklist } = fastify.db;
  const { Op } = require('sequelize');

  async function getCheckListDue(interval, timeNow) {
    try {
      const resp = await Checklist.sequelize.query(`
      SELECT users.id, users.name, tk.user_id tk_user_id, tk.token
        FROM
            (SELECT  grouped.*, NOW(), u1.email, u1.id AS usid
            FROM
              (SELECT 
                chk.id,
                chk.name,
                chk.type,
                chkBranch.role_id,
                chkBranch.user_id,
                MAX(TIME(expiration)) maxTime
            FROM Checklists AS chk
            INNER JOIN MainTasks AS main ON chk.id = main.checkList_id AND main.enable > 0
            INNER JOIN SubTasks AS sub ON main.id = sub.mainTask_id AND sub.enable > 0 AND sub.expiration IS NOT NULL
            INNER JOIN ChecklistBranch AS chkBranch ON chk.id = chkBranch.checklist_id
            WHERE chk.enable > 0
            GROUP BY chk.id , chk.name , chk.type , chkBranch.role_id , chkBranch.user_id) AS grouped
            LEFT JOIN RoleUser AS ru ON grouped.role_id = ru.role_id
            LEFT JOIN Users AS u1 ON u1.id = CASE
                WHEN grouped.user_id IS NOT NULL THEN grouped.user_id
                ELSE ru.user_id
            END
            WHERE TIMESTAMPDIFF  (MINUTE, TIME('${timeNow}'),  time(maxTime)  )  between 0 and ${interval} ) users
                INNER JOIN TokenUsers tk ON users.usid = tk.user_id
                AND tk.type = 'notification'
      `);
      // console.log('cz ----------------- ' + JSON.stringify(resp, null, 2));

      return resp[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCheckListDue,
  };
};
