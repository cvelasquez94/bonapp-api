module.exports = (fastify) => {
  const { User, RoleUser, Branches, user_branches } = fastify.db;
  async function signIn(email, pwd) {
    try {
      const user = await User.findOne({
        where: { email, pwd },
        // subQuery: false,
        include: [
          {
            model: RoleUser,
            as: 'roleUser',
            required: true,
          },
          {
            attributes: ['branch_id'],
            model: user_branches,
            as: 'user_branches',
            
            required: false,
            include: [
              {
                attributes: ['name'],
                model: Branches,
                as: 'branches',
                required: true,
              }
          ]
          }
        ],
        order: [
          [user_branches, 'updatedAt', 'DESC']
        ],
      });
      console.log('user', JSON.stringify(user))

      if (!user) {
        throw new Error('No user');
      }
      // console.log('branch', user)
      console.log('user', user.dataValues.roleUser)

      
      const roles = user.dataValues.roleUser.map((item) => {
        return item.dataValues.role_id;
      });
      if (user.dataValues.user_branches.length > 0){
        user.branch_id = user.dataValues.user_branches[0].dataValues.branch_id
        user.branch_name = user.dataValues.user_branches[0].dataValues.branches.dataValues.name
      }
      return { ...user, roles };
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    signIn,
  };
};
