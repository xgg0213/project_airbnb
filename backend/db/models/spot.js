'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(
        models.User,
        {
          as: 'Owner',
          foreignKey:"ownerId"
        }
      );
      Spot.hasMany(
        models.Review,
        {
          foreignKey:"spotId",
          onDelete: "CASCADE"
        }
      );
      Spot.hasMany(
        models.Image,
        {
          as: 'SpotImages',
          foreignKey: "imageableId",
          constraints: false,
          scope: {
            imageableType: 'Spot'
          }
        }
      )

    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -90,
        max: 90,
      }
    },
    lng: {
      type: DataTypes.DECIMAL,
      validate: {
        min: -180,
        max: 180
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [0,50]
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      validate:{
        isPositive(value) {
          if (parseInt(value) <= 0) {
            throw new Error('Price per day must be a positive number');
          }
        }
      }
    },

  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};