module.exports = (fastify) => {
  const { Document } = fastify.db;
  const fetch = require('node-fetch');

  const delImageFromBucket = async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: 'Basic U1JWX2JvbmFwcDo3SVZKdW4xNC48TH1URVBJaEIzKQ==', // Asegúrate de incluir la autorización correcta
      },
    });

    // if (!response.ok) {
    //   throw new Error(`Failed to fetch image: ${response.statusText}`);
    // }
  
    return response.status
  }
  

  async function deleteImage(data) {
    try {

      const existingInstance = await Document.findOne({
        where: {
          id: data.id
        },
      });

      //console.log('instance: ' + JSON.stringify(existingInstance));

      if (!existingInstance) {
        throw new Error('Document not found');
      }

      const url = `https://swiftobjectstorage.sa-santiago-1.oraclecloud.com/v1/axmlczc5ez0w/bucket-bonapp/${existingInstance.dataValues.url}`
      
      const resp = await delImageFromBucket(url)

      console.log('res ', resp);

      const delet = await Document.destroy({
        where: {
           id: data.id
        }
     }).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
       return rowDeleted+' rowDeleted successfully'
     }, function(err){
         console.log(err); 
     });

      
      console.log('delet: ' + delet);

      return resp;

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteImage,
  };
};
