'use strict';
const { Model, Op } = require('sequelize');

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
      user_id: DataTypes.INTEGER,
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
      defaultScope: {
        where: {
          sentTime: {
            [Op.gte]: sequelize.literal('DATE_SUB(NOW(), INTERVAL 7 DAY)'),
            },
          },
      },
      sequelize,
      modelName: 'Notifications',
    }
  );
  return Notifications;
};
