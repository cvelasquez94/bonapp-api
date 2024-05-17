module.exports = (fastify) => {
  const { Document, STaskInstance } = fastify.db;
  const { Op } = require('sequelize');
  const multer = require('multer');
  const fs = require('fs');
  const path = require('path');

  const mergeChunks = async (fileName, totalChunks) => {    
    const chunkDir = path.join(__dirname,'chunks')
    const mergedFilePath = path.join(__dirname ,'merged_files');
  
    if (!fs.existsSync(mergedFilePath)) fs.mkdirSync(mergedFilePath);
    
    const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
    for (let i = 0; i < totalChunks; i++) {
      const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
      const chunkBuffer = await fs.promises.readFile(chunkFilePath);
      writeStream.write(chunkBuffer);
      fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
    }
  
    writeStream.end();
    console.log("Chunks merged successfully");
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

  return {
    upload,
  };
};
