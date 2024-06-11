'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportBody extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  ReportBody.init({
    type: DataTypes.STRING,
    text: DataTypes.TEXT,
    enable: DataTypes.TINYINT,
  }, {
    sequelize,
    modelName: 'ReportBody',
    freezeTableName: true,
  });
  return ReportBody;
};