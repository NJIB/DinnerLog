module.exports = function(sequelize, DataTypes) {
    const Meal = sequelize.define('Meal', {
      date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      meal: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      protein: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      vegetable: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      carb: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
    });
  
    // Route.associate = function(models) {
    //   // We're saying that a SubSegment should belong to an Segment
    //   // A SubSegment can't be created without an Segment due to the foreign key constraint
    //   Route.belongsTo(models.Segment, {
    //     foreignKey: {
    //       allowNull: false,
    //     },
    //   });
    // };
  
    return Meal;
  };