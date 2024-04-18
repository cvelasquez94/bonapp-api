module.exports = (fastify) => {
  const { User } = fastify.db

  async function getUsers() {
    try {
      const users = await User.findAll()
      if(!users) {
        throw new Error('usuarios no encontrados')
      }
      console.log(users)
      return users;
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getUsers
  }
}
