module.exports = (fastify) => {
  const { TokenUser } = fastify.db;

  async function getTokenUser(user_id) {
    try {
      const data = await TokenUser.findAll({ where: { user_id } });
      if (!data.length) {
        throw new Error('Token no encontrados para el usuario');
      }
      //console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getTokenUser,
  };
};
