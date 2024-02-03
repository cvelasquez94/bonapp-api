module.exports = (fastify) => {
  const { User, RoleUser, Branches, user_branches, Checklist } = fastify.db;
  async function signIn(email, pwd) {
    try {
      const user = await User.findOne({
        where: { email, pwd },
        include: [
          {
            model: RoleUser,
            as: 'roleUser',
            required: true,
          },
        
          {
            model: user_branches,
            as: 'user_branches',            
            required: false,
            include: [
              {
                attributes: ['name','patent_url'],
                model: Branches,
                as: 'branches',
                required: true,
              }
          ]
          
          },
        ],
        order: [
          [user_branches, 'updatedAt', 'DESC']
        ],
      });

      if (!user) {
        throw new Error('No user');
      }

      
    const branch_id = user.dataValues.user_branches[0].branch_id;

    const roles = user.dataValues.roleUser.map((item) => {
        return item.dataValues.role_id;
      });

    const checklists = await Checklist.findAll({
        where: { role_id: roles },
        attributes: [Checklist.sequelize.fn('DISTINCT', Checklist.sequelize.col('type')) ,'type'], //['type']
    });

    let auditor, checklister = false;

    auditor = checklists.some(x => x.type ==='audit')
    checklister = checklists.some(x => x.type ==='checklist')

    const branches = user.dataValues.user_branches.map((user_branches) => {
        return {branch_id: user_branches.dataValues.branch_id, branch_name: user_branches.dataValues.branches.name, patent_url: user_branches.dataValues.branches.patent_url}
      });

    return { ...user.dataValues, roles, branches, branch_id, auditor, checklister};

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    signIn,
  };
};
