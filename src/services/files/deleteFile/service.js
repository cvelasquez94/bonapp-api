module.exports = (fastify) => {
  const { File, FileBranch } = fastify.db;


  const delFileToBucket = async (url, data) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: fastify.config.storage.auth,
    },
     //body: data
    });
  
    if (!response.ok) {
      console.log(`Failed to delete bucket file: ${response.statusText} -> ${url}`);
    }
  
    return response.status
  }


  async function deleteFile(body) {

    const file = await File.findOne({
      where: { ID: body.id },
    })

    if(!file){
      throw new Error('File no existe');
    }


    let urlBuck = '';
    try {
        urlBuck = `${fastify.config.storage.url}files/${file.FileName}`
        const responseDel = await delFileToBucket(urlBuck)
        //console.log(responseDel, urlBuck)

      await FileBranch.destroy(
                              { where: { file_id: body.id } }
                              ); 

      const data = await File.destroy(
                                      { where: { ID: body.id } }
                                      );
      if (!data) {
        throw new Error('File delete error');
      }
      
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteFile,
  };
};

