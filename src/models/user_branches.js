'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_branches extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user_branches.belongsTo(models.Branches, {
        foreignKey: 'branch_id', // Asegúrate de que 'checkList_id' sea el nombre correcto de la columna de la FK
        as: 'branches', // Esto es opcional, pero ayuda a definir cómo llamar a la asociación
      })

      user_branches.belongsTo(models.User, {
        foreignKey: 'user_id'
      })
    }
  }
  user_branches.init(
    {
      user_id: DataTypes.INTEGER,
      branch_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'user_branches',
    }
  )
  return user_branches;
};
