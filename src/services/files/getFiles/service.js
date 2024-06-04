module.exports = (fastify) => {
  const { File, FileBranch, Categories } = fastify.db;
  const { Op } = require('sequelize')

  async function getFiles(query) {
    try {
    let data;
    let includeCateg;

    const search = query.search_text ? query.search_text : '';

    let whereText = {[Op.or]: [ {FileName: {[Op.like]: `%${search}%`}},
                                {Description: {[Op.like]: `%${search}%`}}]}

    if (query.category_id){
          includeCateg = {
                            model: Categories,
                            as: 'fileCategory',
                            required: true,
                            attributes: [],
                            where: { id: query.category_id}
                          }
    }else{
          includeCateg = {
                          model: Categories,
                          as: 'fileCategory',
                          required: false,
                          attributes: [],
                        }
    }

      if(query.branch_id){
        data = await File.findAll({
          where: whereText,
          include: [
            {
              model: FileBranch,
              required: true,
              where: { branch_id: query.branch_id },
            },
            includeCateg
          ],
          order: [[FileBranch, 'updatedAt', 'ASC']],
        });
      }else{
        data = await File.findAll({
          where: whereText,
          include: [
            {
              model: FileBranch,
              required: false,
            },
            includeCateg
          ],
        });
      }

      if (!data) {
        throw new Error('Files no encontrados');
      }
      //console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getFiles,
  };
};
