const { logEvent } = require("firebase/analytics");

module.exports = (fastify) => {
  const { Restaurant } = fastify.db
  async function getRestaurant(restaurantid, limit) {
    try {
      let queryConfig;

      if (restaurantid) {
        queryConfig = {
          where: {id: restaurantid}
        }
      }
      else {
        queryConfig = {}
      };

    const restaurant = await Restaurant.findAll(queryConfig);

      if(!restaurant) {
        throw new Error('No restaurant')
      }
      return restaurant
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getRestaurant
  }
}
