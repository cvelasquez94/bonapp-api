module.exports = (fastify) => {
  const { File } = fastify.db;
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
        mp4: 'video/mp4',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg', // A veces se recibe jpg como jpeg
        png: 'image/png',
        pdf: 'application/pdf',
        ppt: 'application/vnd.ms-powerpoint',
        doc: 'application/msword',  // Para archivos .doc
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',  // Para archivos .docx
        xls: 'application/vnd.ms-excel',  // Para archivos .xls
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  // Para archivos .xlsx
    };
    return mimeTypes[type.toLowerCase()] || type; // Tipo genérico por defecto
  }

  async function postFile(body) {
    const { FileName, FileBase64, FileType } = body;
    let urlPut = '';
    try {
      if(FileBase64) {
        const buffer = Buffer.from(FileBase64.split(',')[1], 'base64');
        urlPut = `${fastify.config.storage.url}files/${FileName}`
        const responsePut = await putFileToBucket(urlPut, typeFormate(FileType), buffer)
        console.log(responsePut, urlPut)
      }

      const data = await File.create({...body, FilePath: `files/${FileName}` });
      if (!data) {
        throw new Error('File error create');
      }
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  // async function putFileToBucket(url, contentType, buffer) {
  //   const client = new ObjectStorageClient(bucket);
  //   const putRequest = new requests.PutObjectRequest({
  //       namespaceName: 'tuNamespace',
  //       bucketName: 'tuBucket',
  //       objectName: 'tuObjeto',
  //       putObjectBody: buffer,
  //       contentType: contentType
  //   });
  
  //   try {
  //       const response = await client.putObject(putRequest);
  //       return response;
  //   } catch (err) {
  //       console.error('Error uploading file:', err);
  //       throw err;
  //   }
  // }

  return {
    postFile,
  };
};

