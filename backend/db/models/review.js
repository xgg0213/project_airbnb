'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(
        models.Spot,
        {
          foreignKey: "spotId",
          onDelete: 'CASCADE',
          hooks: true,
        }
      );
      Review.belongsTo(
        models.User,
        {
          foreignKey: "userId",
          onDelete: 'CASCADE',
          hooks: true,
        }
      );
      Review.hasMany(
        models.ReviewImage,
        {
          as: 'ReviewImages',
          foreignKey: "reviewId",
          onDelete: 'CASCADE',
          hooks: true,
        }
      )
    }
  }
  Review.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    stars: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
    indexes: [
      {
        unique: true,
        fields: ['spotId', 'userId']
      }
    ]
  });
  return Review;
};