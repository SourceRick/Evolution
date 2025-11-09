const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AtalhoAcessibilidade = sequelize.define('AtalhoAcessibilidade', {
    id_atalho: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tecla: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    acao: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    categoria: {
      type: DataTypes.ENUM('Navegacao', 'Tema', 'Midia', 'Geral'),
      defaultValue: 'Geral'
    }
  }, {
    tableName: 'atalho_acessibilidade'
  });

  return AtalhoAcessibilidade;
};