module.exports = (fastify) => {
  const { TokenUser } = fastify.db;

  async function createTokenUser(body) {
    try {
      const existingToken = await TokenUser.findOne({
        where: { user_id: body.userId, type: body.type },
      });

      if (!existingToken)
        return await TokenUser.create({ ...body, user_id: body.userId });

      return existingToken.update({ token: body.token, device: body.device });
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createTokenUser,
  };
};
