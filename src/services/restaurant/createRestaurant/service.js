module.exports = (fastify) => {
  const { Restaurant } = fastify.db;

  async function createRestaurant(body) {
    try {
      let chObj = {
        name: body.name,
        category: body.category,
        food_type: body.food_type,
        rut: body.rut,
        start_date: body.start_date,
        spa_name: body.spa_name,
        logo_url: body.logo_url,
        enable: body.enable,
      }

      if(body.id)
      {
        chObj = { ...chObj, id: body.id}
      }

      const chRet = await Restaurant.create(chObj);

      return chRet

        
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createRestaurant,
  };
};