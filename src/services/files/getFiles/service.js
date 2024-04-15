module.exports = (fastify) => {
  const { File } = fastify.db;

  async function getFiles() {
    try {
      const data = await File.findAll();
      if (!data) {
        throw new Error('Notificaciones no encontrados');
      }
      console.log(data);
      return data;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getFiles,
  };
};
