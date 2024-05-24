module.exports = (fastify) => {
  const { bucket } = fastify.config.storage;

  const { Document, STaskInstance } = fastify.db;
  const { Op } = require('sequelize');
  const multer = require('multer');
  const oci = require("oci-sdk");
  const common = require("oci-common");
  const ocio = require('oci-objectstorage')
  const fs = require('fs');
  const path = require('path');

  const mergeChunks = async (fileName, totalChunks) => {    
    const chunkDir = path.join(__dirname,'chunks')
    const mergedFilePath = path.join(__dirname ,'merged_files');
  
    if (!fs.existsSync(mergedFilePath)) fs.mkdirSync(mergedFilePath);
    
    const finalFilePath = `${mergedFilePath}/${fileName}`;

    const writeStream = fs.createWriteStream(finalFilePath);
    for (let i = 0; i < totalChunks; i++) {
      const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
      const chunkBuffer = await fs.promises.readFile(chunkFilePath);
      writeStream.write(chunkBuffer);
      fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
    }

    writeStream.end()
  
    writeStream.on('close', async () => {
      console.log("Chunks merged successfully22222222");
      // Call the function to upload the merged file to OCI
      await uploadToOCI(finalFilePath, fileName);
      console.log("Chunks successfully OCI");

    });
  };
  
  async function upload(payload) {
    try {
      const { file, chunkNumber, totalChunks, fileName } = payload;
      console.log('upload----------------',payload);
      const chunk = file.buffer;
      console.log('chunk', chunk);

      const chunkDir = path.join(__dirname,'chunks'); // Directory to save chunks
      if (!fs.existsSync(chunkDir)) fs.mkdirSync(chunkDir);
      
      const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

      
        await fs.promises.writeFile(chunkFilePath, chunk);
        console.log(`Chunk ${chunkNumber}/${totalChunks} saved`);
    
        if (chunkNumber === totalChunks - 1) {
          // If this is the last chunk, merge all chunks into a single file
          await mergeChunks(fileName, totalChunks);
          console.log("File merged successfully");
        }                  

  
    } catch (error) {
      throw new Error(error);
    }
  }

  const uploadToOCI = async (filePath, fileName) => {
    console.log(bucket)
    const provider = new common.SimpleAuthenticationDetailsProvider(bucket.tenancy, bucket.user, bucket.fingerprint, bucket.privateKey,null,bucket.privateKey.replace(/\\n/g, '\n'));
    console.log('provider')
    const client = new ocio.ObjectStorageClient(provider);
    console.log('cliente')
    const namespace = "axmlczc5ez0w"; // Reemplaza con tu namespace de OCI
    const bucketName = "bucket-bonapp"; // Reemplaza con el nombre de tu bucket
  
    try {
      const fileStream = fs.createReadStream(filePath);
      const stats = fs.statSync(filePath);

      const objectName = `files/${fileName}`;
  
      const putObjectRequest = {
        namespaceName: namespace,
        bucketName: bucketName,
        putObjectBody: fileStream,
        objectName: objectName,
        contentLength: stats.size
      };
  
      const response = await client.putObject(putObjectRequest);
      console.log("File uploaded successfully to OCI:", response);
    } catch (error) {
      console.error("Error uploading file to OCI:", error);
    }
  };

  return {
    upload,
  };
};
