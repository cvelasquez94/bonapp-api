module.exports = (fastify) => {
  const { Branches, user_branches } = fastify.db;

  async function getBranchsUser(user_id) {
    try {
      const branches = await user_branches.findAll({
        attributes: ['branches.id', 'branches.name'],
        where: { user_id },
        include: [
          {
            model: Branches,
            as: 'branches',
            required: true,
          },
        ],
        group: ['branches.id', 'branches.name'],
      });
      if (branches.length === 0)
        throw new Error(`No existen branch para el usuario ${user_id}`);

      const result = branches.map((item) => {
        const { id, name } = item.dataValues.branches.dataValues;
        return { id, name };
      });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getBranchsUser,
  };
};
