module.exports = (fastify) => {
  const { STaskInstance } = fastify.db
  async function getSTaskInstance(roleid, branchid, limit) {
    try {
      const taskInstance = await STaskInstance.findAll()
      //console.log(taskInstance)
      if(!taskInstance) {
        throw new Error('No taskInstance')
      }
      return taskInstance
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getSTaskInstance
  }
}
