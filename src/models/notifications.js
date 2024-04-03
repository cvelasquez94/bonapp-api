'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notifications extends Model {
    static associate(models) {
      Notifications.belongsTo(models.Statuses, {
        foreignKey: 'status_id',
      });
    }
  }
  Notifications.init(
    {
      messageId: DataTypes.STRING,
      status_id: DataTypes.INTEGER,
      read: DataTypes.TINYINT,
      title: DataTypes.STRING,
      body: DataTypes.STRING,
      dataCustom: DataTypes.STRING,
      type: DataTypes.STRING,
      from: DataTypes.STRING,
      device: DataTypes.STRING,
      obs: DataTypes.STRING,
      sentTime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Notifications',
    }
  );
  return Notifications;
};
