module.exports = (fastify) => {
  const { Checklist } =
    fastify.db;

  async function getChecklistAll(body) {
    try {

      let Checklists = await Checklist.unscoped().findAll();

      if (!Checklists) {
        throw new Error('Checklists no encontrado');
      }

      return Checklists

    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    getChecklistAll,
  };
};
