module.exports = (fastify) => {
  const { Restaurant } = fastify.db;

  async function deleteRestaurant(body) {
    try {

      const ch = await Restaurant.unscoped().findOne({
        where: { id: body.id },
      })
      
      if(!ch){
        throw new Error('Restaurant no existe');
      }


      const resp = await Restaurant.unscoped().update({ enable: 0}, {
        where: {
          id: body.id
        }
      });

      return resp

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteRestaurant,
  };
};
