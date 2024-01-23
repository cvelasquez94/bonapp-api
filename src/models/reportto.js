'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ReportTo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ReportTo.belongsTo(models.Checklist, {
        foreignKey: 'checklist_id',
        as: 'Checklist',
      });
      ReportTo.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'Role',
      });
    }
  }
  ReportTo.init(
    {
      checklist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.Checklist,
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.Role,
          key: 'id',
        },
      },
    },
    {
      sequelize,
      modelName: 'ReportTo',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ReportTo;
};
