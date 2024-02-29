module.exports = (fastify) => {
  const { Document } = fastify.db;
  const fetch = require('node-fetch');

  const delImageFromBucket = async (url) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: fastify.config.storage.auth
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

      const url = `${fastify.config.storage.url}${existingInstance.dataValues.url}`
      
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
