module.exports = (fastify) => {
  const { File, FileBranch } = fastify.db;
  const { bucket } = fastify.config.storage;


  const putFileToBucket = async (url, contentType, data) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: fastify.config.storage.auth,
        'Content-Type': contentType
    },
     body: data
    });
  
    if (!response.ok) {
      throw new Error(`Failed to put file: ${response.statusText}`);
    }
  
    return response.status
  }

  const typeFormate = (type) => {
    const mimeTypes = {
      'video/mp4': 'mp4',
      'image/jpeg': 'jpg',
      'image/png': 'png',
      'application/pdf': 'pdf',
    };
    return mimeTypes[type.toLowerCase()] || type; // Tipo genérico por defecto
  }

  async function postFile(body) {
    const { FileName } = body;
    try {
      const data = await File.create({...body, FileType: typeFormate(body.FileType), FilePath: `files/${FileName}` });
      if (!data) {
        throw new Error('File error create');
      }
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    postFile,
  };
};

