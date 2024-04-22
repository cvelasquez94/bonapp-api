module.exports = (fastify) => {
  const { Restaurant } = fastify.db;

  async function updateRestaurant(body) {
    try {

      const cb = await Restaurant.unscoped().findOne({
          where: {id: body.id},
        })
      

      if(!cb){
        throw new Error('Restaurant no existe');
      }

      let dataUpdate = {}
      if(body.name) dataUpdate.name = body.name
      if(body.category) dataUpdate.category = body.category
      if(body.food_type) dataUpdate.food_type = body.food_type
      if(body.rut) dataUpdate.rut = body.rut
      if(body.start_date) dataUpdate.start_date = body.start_date
      if(body.spa_name) dataUpdate.spa_name = body.spa_name
      if(body.logo_url) dataUpdate.logo_url = body.logo_url
      if(body.enable === 0 || body.enable === 1) dataUpdate.enable = body.enable

      const cbu = await cb.update(dataUpdate)

      return cbu;
      
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateRestaurant,
  };
};
