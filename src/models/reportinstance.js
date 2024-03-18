'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportInstance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReportInstance.belongsTo(models.User, {
        foreignKey: 'user_id',
      })
    }
    static associate(models) {
      ReportInstance.belongsTo(models.Branch, {
        foreignKey: 'branch_id',
      })
    }
    static associate(models) {
      ReportInstance.belongsTo(models.Checklist, {
        foreignKey: 'checklist_id',
      })
    }
  }
  ReportInstance.init({
    name: DataTypes.STRING,
    comment: DataTypes.STRING,
    url: DataTypes.STRING,
    checklist_id: DataTypes.INTEGER,
    branch_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    dateNow: DataTypes.STRING,
    subject: DataTypes.STRING,
    mailTo: DataTypes.STRING,
    size: DataTypes.INTEGER,
    contentType: DataTypes.STRING,
    flagPreview: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'ReportInstance',
  });
  return ReportInstance;
};