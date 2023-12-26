module.exports = (fastify) => {
  const { User } = fastify.db
  async function signIn(email, pwd) {
    try {
      const user = User.findOne({ where: { email, pwd } })
      if(!user) {
        throw new Error('No user')
      }
      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    signIn
  }
}
