module.exports = (fastify) => {
  const { statusUser } = require('../../../constants/statusConstants');
  const { User, RoleUser, Branches, user_branches, Restaurant } = fastify.db;
  async function signIn(email, pwd) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: RoleUser,
            as: 'roleUser',
            required: true,
          },
          {
            model: user_branches,
            as: 'user_branches',
            required: false,
            include: [
              {
                attributes: ['name', 'short_name', 'patent_url'],
                model: Branches,
                as: 'branches',
                required: true,
                include: [
                  {
                    attributes: ['id', 'name'],
                    model: Restaurant,
                    as: 'Restaurant',
                  },
                ],
              },
            ],
          },
        ],
        order: [[ {model: user_branches, as: 'user_branches'}, { model: Branches, as: 'branches' }, 'short_name', 'ASC']],
      });

      if (!user) {
        throw new Error('User no configurado');
      }

      const bcrypt = require('bcrypt');
      /*esto para encriptar y guardar en la BD:
      const saltRounds = 10;
      const encryptedPassword = await bcrypt.hash(pwd, saltRounds)
      //console.log('pwd: '+ pwd)
      //console.log('encryptedPassword: '+ encryptedPassword)*/

      const comparison = await bcrypt.compare(pwd, user.dataValues.pwd);

      if (!comparison) {
        //loginretries incrementa
        user.increment({ loginRetries: +1 });

        //TODO: Confirman   Bloquear user si intentos > 5 ??

        throw new Error('User/Password incorrectos');
      }
      if (user.dataValues.status_id === statusUser.BAJA) {
        throw new Error(
          'User dado de baja, por favor contactarse con el administrador'
        );
      }
      if (user.dataValues.status_id === statusUser.BLOQUEADO) {
        throw new Error('Por favor revise el email/intente recuperar password');
      }

      // if (user.dataValues.status_id === statusUser.NUEVO) {
      //   //login firstTime, retries to zero; status 101
      //   user.update({ status_id: 101, loginRetries: 0 });
      // } else {
      //   //login Ok, retries to zero
      //   user.update({ loginRetries: 0 });
      // }
      user.update({ loginRetries: 0 });

      const branch_id = user.dataValues.user_branches[0].branch_id;

      const roles = user.dataValues.roleUser.map((item) => {
        return item.dataValues.role_id;
      });

      const branches = user.dataValues.user_branches.map((user_branches) => {
        return {
          branch_id: user_branches.dataValues.branch_id,
          branch_name: user_branches.dataValues.branches.name,
          branch_short_name: user_branches.dataValues.branches.short_name,
          patent_url: user_branches.dataValues.branches.patent_url,
          restaurant_id: user_branches.dataValues.branches.Restaurant.id,
          restaurant_name: user_branches.dataValues.branches.Restaurant.name,
        };
      });

      return { ...user.dataValues, roles, branches, branch_id };
    } catch (error) {
      throw new Error(error);
    }
  }

  return {
    signIn,
  };
};
