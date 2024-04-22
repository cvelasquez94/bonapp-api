module.exports = (fastify) => {
  const { statusUser } = require('../../../constants/statusConstants');
  const { User, user_branches } = fastify.db
  const { Op } = require('sequelize');

  async function getUsersByBranch(branchId) {
    try {
      const users = await User.findAll({
        where: {status_id: { [Op.ne]: statusUser.BAJA }},
        include: [
          {
            model: user_branches,
            as: 'user_branches',
            attributes: [],
            required: true,
            where: { branch_id: branchId },
            
          },
        ],
        order: [['id', 'ASC']],
      });


      if(!users) {
        throw new Error('usuarios no encontrados')
      }
      
      return users;
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getUsersByBranch
  }
}
