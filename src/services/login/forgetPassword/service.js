const { mail, generateNewPassword, encryptWord } = require('../../../utils');
const { Op } = require('sequelize');

module.exports = (fastify) => {
  const { User } = fastify.db;

  async function forgetPassword(email) {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase(), status_id: { [Op.ne]: 100 } }, // != BAJA
      });
      if (!user) {
        throw new Error('Email no existe en el sistema o fue dado de baja.');
      }

      const randomstring = `BonApp*${generateNewPassword()}`;
      const encryptedPassword = await encryptWord(randomstring);
      user.update({ status_id: 102, pwd: encryptedPassword }); // status NUEVO

      mail.ForgetPassEmail(user.dataValues.email, randomstring);
      //TODO: TEMPLATE HTML EMAIL CON REPLACE VARIABLES

      return;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    forgetPassword,
  };
};
