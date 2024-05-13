const ociObjectStorage = require('oci-objectstorage');
const { AuthenticationDetailsProvider } = require('oci-common');

module.exports = (fastify) => {
    const { bucket } = fastify.config.storage;
  
    async function getPreSignedUrl(bucketName, objectName, expirationTimeInSeconds) {
        // console.log(bucket)
        const provider = new AuthenticationDetailsProvider(bucket);
    
        const client = new ociObjectStorage.ObjectStorageClient({ authenticationDetailsProvider: provider });
        const namespace = await client.getNamespace({}); // Asegúrate de manejar errores aquí
    
        const createPreauthenticatedRequestDetails = {
            name: `upload-preauth-${Date.now()}`,
            objectName: objectName,
            bucketName: bucketName,
            namespaceName: namespace,
            accessType: ociObjectStorage.models.CreatePreauthenticatedRequestDetails.AccessType.ObjectWrite,
            timeExpires: new Date(new Date().getTime() + expirationTimeInSeconds * 1000)
        };
    
        const response = await client.createPreauthenticatedRequest(createPreauthenticatedRequestDetails);
        return response.data.accessUri;
    }
  
    return {
        getPreSignedUrl,
    };
  };
    