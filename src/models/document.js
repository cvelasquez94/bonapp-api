'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Document.belongsTo(models.STaskInstance, {
        foreignKey: 'staskInstance_id',
        as: 'documents' // Este es un alias opcional
      })
    }
  }
  Document.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    size: DataTypes.STRING,
    url: DataTypes.STRING,
    staskInstance_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};