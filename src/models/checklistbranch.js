'use strict';
const { Model, Op } = require('sequelize');
const TODAY_START = new Date();
TODAY_START.setHours(0, 0, 0, 0);
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
      ChecklistBranch.belongsTo(models.Role, {
        foreignKey: 'role_id',
        as: 'role',
      });
    }
  }
  ChecklistBranch.init(
    {
      checklist_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Checklist,
          key: 'id',
        },
      },
      branch_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Branches,
          key: 'id',
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.User,
          key: 'id',
        },
      },
      role_id: {
        type: DataTypes.INTEGER,
        references: {
          model: Model.Role,
          key: 'id',
        },
      },
      enable: DataTypes.TINYINT,
      notificationEnabled: DataTypes.TINYINT,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      freqType: DataTypes.STRING,
      freqValue: DataTypes.INTEGER,
      flagRecurrent: DataTypes.TINYINT,
      monday: DataTypes.TINYINT,
      tuesday: DataTypes.TINYINT,
      wednesday: DataTypes.TINYINT,
      thursday: DataTypes.TINYINT,
      friday: DataTypes.TINYINT,
      saturday: DataTypes.TINYINT,
      sunday: DataTypes.TINYINT,
    },
    {
      defaultScope: {
        where: {
        [Op.and]: [
              { 
              enable: {
                [Op.gt]: 0
              },
              start_date:
                //{ [Op.lte]: TODAY_START }
                sequelize.where(sequelize.fn("DATE", sequelize.col("ChecklistBranch.start_date")), "<=", sequelize.fn("DATE",TODAY_START.toISOString().split('T')[0]))
              ,
              [Op.or]: [
                {end_date:
                  sequelize.where(sequelize.fn("DATE", sequelize.col("ChecklistBranch.end_date")), ">=", sequelize.fn("DATE",TODAY_START.toISOString().split('T')[0]))
                },
                {end_date: {[Op.is]: null}},
              ]
              },               
              ,
                sequelize.literal(
                  `CASE WHEN freqType is null then 1=1 
                        WHEN freqType = 'd' THEN DATEDIFF(CURDATE(),start_date) % freqValue = 0
                        WHEN freqType = 'w' THEN 
                                            CASE WHEN weekday(CURDATE()) = 0 THEN monday > 0
                                             WHEN weekday(CURDATE()) = 1 THEN tuesday > 0
                                             WHEN weekday(CURDATE()) = 2 THEN wednesday > 0
                                             WHEN weekday(CURDATE()) = 3 THEN thursday > 0
                                             WHEN weekday(CURDATE()) = 4 THEN friday > 0
                                             WHEN weekday(CURDATE()) = 5 THEN saturday > 0 
                                             WHEN weekday(CURDATE()) = 6 THEN sunday > 0 END
                        END`
                )
            ],
          },
      },
      
      sequelize,
      modelName: 'ChecklistBranch',
      freezeTableName: true,
    }
  );
  return ChecklistBranch;
};
