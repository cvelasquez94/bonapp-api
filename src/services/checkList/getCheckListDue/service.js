module.exports = (fastify) => {
  const { Checklist } = fastify.db;
  const { Op } = require('sequelize');

  async function getCheckListDue(interval, dateTime) {
    try {
      const timePayload = dateTime.split(' ');

      if (timePayload.length < 2) throw new Error('Formato time incorrecto');

      const time = timePayload[1].split(':');
      const resp = await Checklist.sequelize.query(`      
        SELECT users.id, users.name, tk.user_id user_id, tk.token, br.short_name branch_name
                FROM
                    (SELECT grouped.*, NOW(), u1.email, u1.id AS usid
                    FROM 
                      (SELECT 
                        chk.id,
                        chk.name,
                        chk.type,
                        chkBranch.role_id,
                        chkBranch.user_id,
                        chkBranch.branch_id,
                        MAX(TIME(expiration)) maxTime
                      FROM Checklists AS chk 
                      INNER JOIN MainTasks AS main ON chk.id = main.checkList_id AND main.enable > 0
                      INNER JOIN SubTasks AS sub ON main.id = sub.mainTask_id AND sub.enable > 0 AND sub.expiration IS NOT NULL
                      INNER JOIN ChecklistBranch AS chkBranch ON chk.id = chkBranch.checklist_id AND chkBranch.enable > 0 AND chkBranch.notificationEnabled > 0
                      WHERE chk.enable > 0
                      GROUP BY chk.id , chk.name , chk.type , chkBranch.role_id , chkBranch.user_id , chkBranch.branch_id) AS grouped
                    LEFT JOIN RoleUser AS ru ON grouped.role_id = ru.role_id
                    LEFT JOIN Users AS u1 ON u1.id = CASE
                                      WHEN grouped.user_id IS NOT NULL THEN grouped.user_id
                                      ELSE ru.user_id
                                    END
                   WHERE 
                        maxTime > TIME('${timePayload[1]}') and maxTime <= TIME( DATE_ADD(MAKETIME(${time[0]},${time[1]},00), INTERVAL ${interval} MINUTE ))
                    ) users
                        INNER JOIN TokenUsers tk ON users.usid = tk.user_id AND tk.type = 'notification' 
                        INNER JOIN Branches br ON br.id = users.branch_id 
                WHERE
                    NOT EXISTS( SELECT 1
                        FROM
                          Checklists chk,
                          MainTasks main,
                          SubTasks sub,
                          STaskInstances sti
                        WHERE
                          chk.id = main.checkList_id
                          AND main.id = sub.mainTask_id
                          AND sub.id = sti.subTask_id
                          AND sti.user_id = users.usid
                          AND sub.expiration IS NOT NULL
                          AND DATE(dateTime) = STR_TO_DATE('${timePayload[0]}', '%d/%m/%Y')
                          AND (sti.comment = 'finalized' or sti.status = 'audited')
                          AND sti.branch_id = users.branch_id
                          AND chk.id = users.id); 
      `);

      return resp[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCheckListDue,
  };
};
