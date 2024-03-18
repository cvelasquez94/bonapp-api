module.exports = (fastify) => {
  const { User, RoleUser, user_branches } = fastify.db;
  const { mail, generateNewPassword, encryptWord } = require('../../../utils');

  async function createUser(body) {
    try {
      const email = body.email.toLowerCase();

      const user = await User.findOne({
        where: { email: email },
      });

      if (user) {
        throw new Error('User ya existente con mismo email');
      }

      const dateSplit = body.birthDate.replaceAll('/', '-').split('-');
      const birthD = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];

      let usrObj = {
        email: email,
        firstName: body.firstName,
        lastName: body.lastName,
        avatar: body.avatar,
        rut: body.rut,
        sex: body.sex,
        phone: body.phone,
        birthDate: birthD,
        status_id: 102,
      };

      const result = await User.sequelize.transaction(async (t) => {
        if (body.directActiveFlag > 0 && body.statusId === 101) {
          const encryptedPassword = await encryptWord(body.pwd);
          usrObj = {
            ...usrObj,
            pwd: encryptedPassword,
            status_id: body.statusId,
          };

          console.log(usrObj);
          const usret = await User.create(usrObj, { transaction: t });

          const rolesCreate = body.roles.map((obj) => ({
            role_id: obj,
            user_id: usret.id,
          }));

          const rolesret = await RoleUser.bulkCreate(rolesCreate, {
            transaction: t,
          });
          console.log(rolesret);

          const branchesCreate = body.branches.map((obj) => ({
            branch_id: obj,
            user_id: usret.id,
          }));

          const branchret = await user_branches.bulkCreate(branchesCreate, {
            transaction: t,
          });
          console.log(branchret);

          return usret;
        } else {
          //usuario dado de alta como Nuevo, llega email con pwd random

          //const pwd = 'BonApp*'+ (Math.random() +1).toString(36).slice(2, 7)
          //const encryptedPassword = await bcrypt.hash(pwd, saltRounds)

          const pwd = `BonApp*${generateNewPassword()}`;
          const encryptedPassword = await encryptWord(pwd);
          console.log(pwd);
          usrObj = { ...usrObj, pwd: encryptedPassword, status_id: 102 };

          const usret = await User.create(usrObj, { transaction: t });

          const rolesCreate = body.roles.map((obj) => ({
            role_id: obj,
            user_id: usret.id,
          }));

          const rolesret = await RoleUser.bulkCreate(rolesCreate, {
            transaction: t,
          });
          //console.log(rolesret)

          const branchesCreate = body.branches.map((obj) => ({
            branch_id: obj,
            user_id: usret.id,
          }));

          const branchret = await user_branches.bulkCreate(branchesCreate, {
            transaction: t,
          });
          //console.log(branchret)

          mail.CreateUserEmail(email, pwd);

          return usret;
        }
      }); //end BD transaction
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    createUser,
  };
};
