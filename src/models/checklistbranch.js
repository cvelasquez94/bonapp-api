'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChecklistBranch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ChecklistBranch.belongsTo(models.Checklist, {
        foreignKey: 'checklist_id',
        as: 'Checklist',
      });
      ChecklistBranch.belongsTo(models.Branches, {
        foreignKey: 'branch_id',
        as: 'branches',
      });
    }
  }
  ChecklistBranch.init(
    {
      checklist_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.Checklist,
          key: 'id',
        },
      },
      branch_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
          model: Model.Branches,
          key: 'id',
        },
      },
      enable: DataTypes.TINYINT,
    },
    {
      defaultScope: {
        where: {
          enable: {
            [Op.gt]: 0
          }
        },
        order: [['orden', 'ASC']]
      },
      sequelize,
      modelName: 'ChecklistBranch',
      freezeTableName: true,
      timestamps: false,
    }
  );
  return ChecklistBranch;
};
