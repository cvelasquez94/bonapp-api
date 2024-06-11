module.exports = (fastify) => {
  const { ReportBody } = fastify.db
  async function postMailBody(typer, text) {
    try {
      const queryConfig = {
        where: { type: typer},
        };

    const MailBodyRet = await ReportBody.findOne(queryConfig);

      if(!MailBodyRet) {
        throw new Error('No MailBody of type: ', typer)
      }
      
    const updRet = await MailBodyRet.update({text});

    return updRet;

    } catch (error) {
      throw new Error(error)
    }
  }

  return {
    postMailBody
  }
}
