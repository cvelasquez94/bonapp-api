module.exports = (fastify) => {
  const { File, FileBranch } = fastify.db;

  async function updateFile(body) {

    const file = await File.findOne({
      where: { ID: body.ID },
    });

    if (!file) {
      throw new Error('File no encontrado');
    }

    try {
      
    const dataUpdate = {};
    
      if (body.FileName) dataUpdate.FileName = body.FileName;
      if (body.FileSize) dataUpdate.FileSize = body.FileSize;
      if (body.FilePath) dataUpdate.FilePath = body.FilePath;
      if (body.Category) dataUpdate.Category = body.Category;
      if (body.Preview) dataUpdate.Preview = body.Preview;
      if (body.Description) dataUpdate.Description = body.Description;

      if (JSON.stringify(dataUpdate) == '{}' && !body.branches)
        return;


      const result = await File.sequelize.transaction(async (t) => {

        if (JSON.stringify(dataUpdate) != '{}')
          await file.update(dataUpdate, { transaction: t });

        if (body.branches) {
          const branchesCreate = body.branches.map((obj) => ({
            branch_id: obj,
            file_id: file.ID,
          }));

          await FileBranch.destroy(
            { where: { file_id: file.ID } },
            { transaction: t }
          );

          await FileBranch.bulkCreate(branchesCreate, { transaction: t });
        }
          return file;
      }); //end BD transaction
      
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }


  return {
    updateFile,
  };
};

