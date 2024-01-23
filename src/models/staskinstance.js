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
    },
    {
      sequelize,
      modelName: 'STaskInstance',
    }
  );
  return STaskInstance;
};
