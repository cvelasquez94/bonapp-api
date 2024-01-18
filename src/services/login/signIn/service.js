module.exports = (fastify) => {
  const { User, user_branches, Branches } = fastify.db
  async function signIn(email, pwd) {
    try {
     const user = await User.findOne(
        { 
        where: { email, pwd } 
        ,subQuery: false
        ,include: [
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
    //raw: true
    })
      if(!user) {
        throw new Error('No user')
      }

      

if (user.dataValues.user_branches.length > 0){
  user.branch_id = user.dataValues.user_branches[0].dataValues.branch_id
  user.branch_name = user.dataValues.user_branches[0].dataValues.branches.dataValues.name
}
/*else{
  user.branch_id = null
  user.branch_name = null
}
*/

   

      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    signIn
  }
}
