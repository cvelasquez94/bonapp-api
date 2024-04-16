const { logEvent } = require("firebase/analytics");

module.exports = (fastify) => {
  const { Branches } = fastify.db
  async function getBranch(branchid, restaurantid, limit) {
    try {
      let queryConfig;

      if (branchid) {
        if (restaurantid) {
          queryConfig = {
            where: {id: branchid, restaurant_id: restaurantid},
          }
        } else {
          queryConfig = {
            where: {id: branchid}
          }
        }
      }
      else if (restaurantid) {
        queryConfig = {
          where: {restaurant_id: restaurantid}
        }
      }
      else {
        queryConfig = {}
      };

    const branch = await Branches.findAll(queryConfig);

      if(!branch) {
        throw new Error('No branch')
      }
      return branch
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getBranch
  }
}
