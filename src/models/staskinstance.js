// models/staskinstance.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class STaskInstance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      STaskInstance.belongsTo(models.SubTask, {
        foreignKey: 'subTask_id',
        as: 'sTaskInstances',
      });
      STaskInstance.hasMany(models.Document, {
        foreignKey: 'staskInstance_id',
        as: 'documents' // Este es un alias opcional
      });
    }
  }
  STaskInstance.init(
    {
      subTask_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      status: DataTypes.STRING,
      dateTime: DataTypes.DATE,
      comment: DataTypes.STRING,
      score: DataTypes.STRING,
      photo: DataTypes.STRING,
      branch_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Branches,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'STaskInstance',
    }
  );
  return STaskInstance;
};
