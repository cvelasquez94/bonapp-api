module.exports = (fastify) => {
  const { ReportBody } = fastify.db
  async function getMailBody(typer) {
    try {
      const queryConfig = {
        where: { type: typer},
    };

    const MailBodyRet = await ReportBody.findOne(queryConfig);
      if(!MailBodyRet) {
        throw new Error('No MailBody')
      }
      return MailBodyRet
    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    getMailBody
  }
}
