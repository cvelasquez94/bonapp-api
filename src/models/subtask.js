'use strict'
const {
  Model, Op
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class SubTask extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Cada SubTask pertenece a un MainTask
      SubTask.belongsTo(models.MainTask, {
        foreignKey: 'mainTask_id', // Asegúrate de que 'mainTask_id' sea el nombre correcto de la columna de la FK
        as: 'mainTask' // Este es un alias opcional
      })

      SubTask.hasMany(models.STaskInstance, {
        foreignKey: 'subTask_id',
        as: 'sTaskInstances' // Este es un alias opcional
      })
    }
  }
  SubTask.init({
    name: DataTypes.STRING,
    desc: DataTypes.STRING,
    expiration: DataTypes.DATE,
    mainTask_id: DataTypes.INTEGER,
    orden: DataTypes.INTEGER,
    scoreMultiplier: DataTypes.INTEGER,
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
    modelName: 'SubTask',
  })
  return SubTask
}
