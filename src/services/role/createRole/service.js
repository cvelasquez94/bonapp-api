module.exports = (fastify) => {
  const { Role } = fastify.db;

  async function createRole(body) {
    try {
      let chObj = {
        name: body.name,
        enable: body.enable,
      }

      if(body.id)
      {
        chObj = { ...chObj, id: body.id}
      }

      const chRet = await Role.create(chObj);

      return chRet

        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createRole,
  };
};