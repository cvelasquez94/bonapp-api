'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class File extends Model {}
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
      }
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
