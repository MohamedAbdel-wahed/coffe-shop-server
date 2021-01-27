'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Table extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Table.init({
    code: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    place: {
      type: DataTypes.STRING,
      allowNull: false
    },
    full: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    modelName: 'Table',
    tableName: 'tables',
  });
  return Table;
};