'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    static associate(models) {
      File.hasMany(models.FileBranch, {
        foreignKey: 'file_id',
        //as: 'fileBranch',
      });
      File.belongsTo(models.Categories, {
        foreignKey: 'Category_ID',
      as: 'fileCategory',
    });
    }
  }
  File.init(
    {
      ID: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      FileName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      FileType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      FileSize: {
        type: DataTypes.BIGINT,
        allowNull: true
      },
      FilePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      CreatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      Category: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      Preview: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      UpdatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW
      },
      Description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      Category_ID: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: Model.Categories,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'File',
      tableName: 'Files',
      timestamps: true,
      createdAt: 'CreatedAt',
      updatedAt: 'UpdatedAt'
      
    }
  );
  return File;
};
