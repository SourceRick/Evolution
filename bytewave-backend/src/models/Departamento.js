const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Departamento = sequelize.define('Departamento', {
    id_departamento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    id_instituicao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'departamento'
  });

  Departamento.associate = function(models) {
    Departamento.belongsTo(models.Instituicao, { foreignKey: 'id_instituicao' });
    Departamento.hasMany(models.Curso, { foreignKey: 'id_departamento' });
  };

  return Departamento;
};