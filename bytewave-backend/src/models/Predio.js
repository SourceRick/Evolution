const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Predio = sequelize.define('Predio', {
    id_predio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    codigo: DataTypes.STRING(10),
    endereco: DataTypes.TEXT,
    andares: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    acessibilidade: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'predio'
  });

  Predio.associate = function(models) {
    Predio.hasMany(models.Sala, { foreignKey: 'id_predio' });
  };

  return Predio;
};