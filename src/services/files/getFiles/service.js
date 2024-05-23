module.exports = (fastify) => {
  const { File, FileBranch } = fastify.db;

  async function getFiles(query) {
    try {
let data;

      if(query.branch_id){
        data = await File.findAll({
          include: [
            {
              model: FileBranch,
              required: true,
              where: { branch_id: query.branch_id },
            },
          ],
          order: [[FileBranch, 'updatedAt', 'ASC']],
        });
      }else{
        data = await File.findAll({
          include: [
            {
              model: FileBranch,
              required: false,
            },
          ],
        });
      }

      if (!data) {
        throw new Error('Notificaciones no encontrados');
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
