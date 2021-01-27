'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    table: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    product: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    description: {
      type: DataTypes.STRING
    },
    inCart: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
    
  }, {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
  });
  return Order;
};