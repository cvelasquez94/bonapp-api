const { logEvent } = require("firebase/analytics");

module.exports = (fastify) => {
  const { Role } = fastify.db
  async function getRoles(limit) {
    try {

    const Roles = await Role.findAll();

      if(!Roles) {
        throw new Error('No Roles')
      }
      return Roles
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getRoles
  }
}
