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

// const Movie = sequelize.define('Movie', { name: DataTypes.STRING });
// const Actor = sequelize.define('Actor', { name: DataTypes.STRING });
// const ActorMovies = sequelize.define('ActorMovies', {
//   MovieId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Movie, // 'Movies' would also work
//       key: 'id',
//     },
//   },
//   ActorId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: Actor, // 'Actors' would also work
//       key: 'id',
//     },
//   },
// });
// Movie.belongsToMany(Actor, { through: ActorMovies });
// Actor.belongsToMany(Movie, { through: ActorMovies });
