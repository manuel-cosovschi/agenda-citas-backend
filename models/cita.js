'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Cita extends Model {
    static associate(models) {
      // define association here
    }
  }

  Cita.init({
    cliente: DataTypes.STRING,
    propiedad: DataTypes.STRING,
    fecha: DataTypes.DATE,
    hora: DataTypes.TIME,
    agenteId: DataTypes.INTEGER,
    clienteTelefono: DataTypes.STRING  // Nuevo campo para el teléfono del cliente
  }, {
    sequelize,
    modelName: 'Cita',
  });
  
  return Cita;
};

