module.exports = (fastify) => {
  const { Branches } = fastify.db;

  async function createBranch(body) {
    try {
      let chObj = {
        name: body.name,
        short_name: body.short_name,
        address: body.address,
        rut: body.rut,
        patent_url: body.patent_url,
        restaurant_id: body.restaurant_id,
        enable: body.enable,
      }

      if(body.id)
      {
        chObj = { ...chObj, id: body.id}
      }

      const chRet = await Branches.create(chObj);

      return chRet

        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createBranch,
  };
};