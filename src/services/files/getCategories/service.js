module.exports = (fastify) => {
  const { File, FileBranch, Categories } = fastify.db;
  const { Op } = require('sequelize');

  async function getCategories(query) {
    try {
    let data;
    let whereTypes = { enable: {[Op.gt]: 0} };

    if (query.type)
      whereTypes = {...whereTypes, type: query.type};
    if (query.subtype)
       whereTypes = {...whereTypes, subtype: query.subtype};

      if(query.branch_id){
        data = await Categories.findAll({
          where: whereTypes,
          include: [
            {
              model: File,
              required: true,
              attributes: [],
              include: {
                model: FileBranch,
                required: true,
                attributes: [],
                where: { branch_id: query.branch_id },
              }
            },
          ],
        });
      }else{
        data = await Categories.findAll({
          where: whereTypes
        });
      }

      if (!data) {
        throw new Error('Categories no encontrados');
      }
      //console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getCategories,
  };
};
