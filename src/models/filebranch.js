'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FileBranch extends Model {
    static associate(models) {
    FileBranch.belongsTo(models.File, {
        foreignKey: 'file_id',
        //as: 'file',
      });
    FileBranch.belongsTo(models.Branches, {
      foreignKey: 'branch_id',
      //as: 'branch',
    });
    FileBranch.belongsTo(models.Role, {
      foreignKey: 'role_id',
      //as: 'role',
    });
  }}
  FileBranch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      file_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.File,
          key: 'ID',
        },
      },
      branch_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Branches,
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Role,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'FileBranch',
      freezeTableName: true,
      timestamps: true,
      
    }
  );
  return FileBranch;
};
