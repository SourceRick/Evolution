const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConfiguracaoSistema = sequelize.define('ConfiguracaoSistema', {
    id_config: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chave: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false
    },
    valor: DataTypes.TEXT,
    tipo: {
      type: DataTypes.ENUM('string', 'number', 'boolean', 'json', 'array'),
      defaultValue: 'string'
    },
    categoria: DataTypes.STRING(50),
    descricao: DataTypes.TEXT,
    editavel: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'configuracao_sistema',
    timestamps: true,
    updatedAt: 'atualizado_em'
  });

  return ConfiguracaoSistema;
};