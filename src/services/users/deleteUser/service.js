module.exports = (fastify) => {
  const { User, RoleUser, user_branches } = fastify.db;
  const nodemailer = require('nodemailer');

  async function deleteUser(body) {
    try {

      const mail = body.email.toLowerCase()

      const user = await User.findOne({
        where: { email: mail },
      })

      if(!user){
        throw new Error('User no existe');
      }

      const resp = await user.update({status_id : 100})
      
      return resp


    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    deleteUser,
  };
};
