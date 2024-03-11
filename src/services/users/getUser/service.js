module.exports = (fastify) => {
  const { User, RoleUser, Branches, user_branches, Restaurant } = fastify.db;

  async function getUser(body) {
    try {

      let user;

      if(body.email){
        const email = body.email.toLowerCase()

        user = await User.findOne({
          where: { email: email },
          include: [
            {
              model: RoleUser,
              as: 'roleUser',
              //required: true,
            },
          
            {
              model: user_branches,
              as: 'user_branches',            
              //required: false,
              include: [
                {
                  attributes: ['name','short_name','patent_url'],
                  model: Branches,
                  as: 'branches',
                  //required: true,
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
        })
      }
      if(body.id){

        user = await User.findOne({
          where: { id: body.id },
          include: [
            {
              model: RoleUser,
              as: 'roleUser',
              //required: true,
            },
          
            {
              model: user_branches,
              as: 'user_branches',            
              //required: false,
              include: [
                {
                  attributes: ['name','short_name','patent_url'],
                  model: Branches,
                  as: 'branches',
                  //required: true,
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
        })
      }

      if(!user){
        throw new Error('User no encontrado');
      }

      const roles = user.dataValues.roleUser.map((item) => {
        return item.dataValues.role_id;
      });

      const branches = user.dataValues.user_branches.map((user_branches) => {
        return user_branches.dataValues.branch_id
      });


      return { ...user.dataValues, statusId: user.dataValues.status_id, roles, branches};
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getUser,
  };
};
