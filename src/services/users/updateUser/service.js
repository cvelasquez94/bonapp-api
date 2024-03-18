module.exports = (fastify) => {
  const { User, RoleUser, user_branches } = fastify.db;

  async function updateUser(body) {
    try {
      const email = body.email.toLowerCase();

      const user = await User.findOne({
        where: { email: email },
      });

      if (!user) {
        throw new Error('User no existe con ese email');
      }

      const dataUpdate = {};

      if (body.firstName) dataUpdate.firstName = body.firstName;
      if (body.lastName) dataUpdate.lastName = body.lastName;
      if (body.avatar) dataUpdate.avatar = body.avatar;
      if (body.rut) dataUpdate.rut = body.rut;
      if (body.sex) dataUpdate.sex = body.sex;
      if (body.statusId) dataUpdate.status_id = body.statusId;
      if (body.phone) dataUpdate.phone = body.phone;
      if (body.birthDate) {
        const dateSplit = body.birthDate.replaceAll('/', '-').split('-');
        const birthD = dateSplit[2] + '-' + dateSplit[1] + '-' + dateSplit[0];
        dataUpdate.birthDate = birthD;
      }
      if (body.pwd) {
        const encryptedPassword = await encryptWord(body.pwd);
        dataUpdate.pwd = encryptedPassword;
      }

      if (JSON.stringify(dataUpdate) == '{}' && !body.branches && !body.roles)
        return;

      console.log(dataUpdate);

      const result = await User.sequelize.transaction(async (t) => {
        if (JSON.stringify(dataUpdate) != '{}')
          await user.update(dataUpdate, { transaction: t });

        if (body.branches) {
          const branchesCreate = body.branches.map((obj) => ({
            branch_id: obj,
            user_id: user.id,
          }));

          await user_branches.destroy(
            { where: { user_id: user.id } },
            { transaction: t }
          );
          await user_branches.bulkCreate(branchesCreate, { transaction: t });
        }

        if (body.roles) {
          const rolesCreate = body.roles.map((obj) => ({
            role_id: obj,
            user_id: user.id,
          }));

          await RoleUser.destroy(
            { where: { user_id: user.id } },
            { transaction: t }
          );
          await RoleUser.bulkCreate(rolesCreate, { transaction: t });
        }

        return user;
      }); //end BD transaction
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    updateUser,
  };
};
