'use strict';
const { Model, Op } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Cada Checklist puede tener muchas MainTasks
      Checklist.hasMany(models.MainTask, {
        foreignKey: 'checkList_id',
        as: 'mainTasks', // Esto es opcional, pero ayuda a definir cómo llamar a la asociación
      });
      Checklist.hasMany(models.ReportTo, {
        foreignKey: 'checklist_id',
        as: 'CheckListReportTo',
      });
      Checklist.hasMany(models.ChecklistBranch, {
        foreignKey: 'checklist_id',
        as: 'ChecklistBranch',
      });
      Checklist.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
    }
  }
  Checklist.init(
    {
      role_id: DataTypes.INTEGER,
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      type: DataTypes.STRING,
      enable: DataTypes.TINYINT,
      schedule_start: DataTypes.DATE,
      schedule_end: DataTypes.DATE,
    },
    
    {
      defaultScope: {
        where: {
          enable: {
            [Op.gt]: 0
          }
        }
      },
    
      sequelize,
      modelName: 'Checklist',
    }
  );
  return Checklist;
};
