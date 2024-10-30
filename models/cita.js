'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cita.init({
    cliente: DataTypes.STRING,
    propiedad: DataTypes.STRING,
    fecha: DataTypes.DATE,
    hora: DataTypes.TIME,
    agenteId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Cita',
  });
  return Cita;
};