module.exports = (fastify) => {
  const { User, RoleUser } = fastify.db;
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
        ],
      });

      if (!user) {
        throw new Error('No user');
      }
      const roles = user.dataValues.roleUser.map((item) => {
        return item.dataValues.role_id;
      });
      return { ...user.dataValues, roles };
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    signIn,
  };
};
