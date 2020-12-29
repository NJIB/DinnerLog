module.exports = function(sequelize, DataTypes) {
    const Meal = sequelize.define('Meal', {
      date: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      meal: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      chicken: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      beef: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      pork: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1, 160],
        },
      },
      veg: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
      other: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
      potato: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
      pasta: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
      rice: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
        },
      },
      other: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          len: [1],
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