'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MainTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Cada MainTask pertenece a un Checklist
      MainTask.belongsTo(models.Checklist, {
        foreignKey: 'checkList_id', // Asegúrate de que 'checkList_id' sea el nombre correcto de la columna de la FK
        as: 'checklist', // Esto es opcional, pero ayuda a definir cómo llamar a la asociación
      });

      // Un MainTask tiene muchas SubTask
      MainTask.hasMany(models.SubTask, {
        foreignKey: 'mainTask_id',
        as: 'subTasks', // Este es un alias opcional
      });
    }
  }
  MainTask.init(
    {
      name: DataTypes.STRING,
      desc: DataTypes.STRING,
      schedule_start: DataTypes.DATE,
      schedule_end: DataTypes.DATE,
      checkList_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'MainTask',
    }
  );
  return MainTask;
};
