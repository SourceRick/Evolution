const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ArquivoTrabalho = sequelize.define('ArquivoTrabalho', {
    id_arquivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_trabalho: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_original: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    nome_arquivo: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    caminho: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    tipo_arquivo: DataTypes.STRING(100),
    tamanho_bytes: DataTypes.BIGINT,
    mimetype: DataTypes.STRING(100),
    ordem: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'arquivo_trabalho',
    timestamps: true,
    createdAt: 'enviado_em'
  });

  ArquivoTrabalho.associate = function(models) {
    ArquivoTrabalho.belongsTo(models.Trabalho, { foreignKey: 'id_trabalho' });
  };

  return ArquivoTrabalho;
};