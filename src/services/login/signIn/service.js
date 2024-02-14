module.exports = (fastify) => {
  const { User, RoleUser, Branches, user_branches, Restaurant } = fastify.db;
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
                attributes: ['name','short_name','patent_url'],
                model: Branches,
                as: 'branches',
                required: true,
                include: [
                  {
                    attributes: ['id','name'],
                    model: Restaurant,
                    as: 'Restaurant',
                  }
              ]
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

      

      const branches = user.dataValues.user_branches.map((user_branches) => {
        return {
          branch_id: user_branches.dataValues.branch_id, 
          branch_name: user_branches.dataValues.branches.name, 
          branch_short_name: user_branches.dataValues.branches.short_name, 
          patent_url: user_branches.dataValues.branches.patent_url,
          restaurant_id: user_branches.dataValues.branches.Restaurant.id,
          restaurant_name: user_branches.dataValues.branches.Restaurant.name,
        }
      });

      return { ...user.dataValues, roles, branches, branch_id};
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    signIn,
  };
};
