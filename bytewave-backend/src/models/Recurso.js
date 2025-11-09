const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recurso = sequelize.define('Recurso', {
    id_recurso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Equipamento', 'Material', 'Software', 'Outros'),
      defaultValue: 'Equipamento'
    },
    descricao: DataTypes.TEXT,
    quantidade_total: DataTypes.INTEGER,
    quantidade_disponivel: DataTypes.INTEGER,
    localizacao: DataTypes.STRING(100),
    especificacoes_tecnicas: DataTypes.JSON,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'recurso'
  });

  Recurso.associate = function(models) {
    Recurso.hasMany(models.AgendamentoRecurso, { foreignKey: 'id_recurso' });
  };

  return Recurso;
};