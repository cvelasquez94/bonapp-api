'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Categories extends Model {
    static associate(models) {
      Categories.hasMany(models.File, {
        foreignKey: 'Category_ID',
        //as: 'fileBranch',
      });    
  }}
  Categories.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      subType: {
        type: DataTypes.STRING(25),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      descrip: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      image_url: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      color: {
        type: DataTypes.STRING(55),
        allowNull: true
      },
      enable: DataTypes.TINYINT,
    },
    {
      sequelize,
      freezeTableName: true,
      timestamps: true,
      
    }
  );
  return Categories;
};
