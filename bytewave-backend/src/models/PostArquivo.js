const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PostArquivo = sequelize.define('PostArquivo', {
    id_post_arquivo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_post: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_original: DataTypes.STRING(255),
    nome_arquivo: DataTypes.STRING(255),
    caminho: DataTypes.STRING(500),
    tipo_arquivo: DataTypes.STRING(100),
    tamanho_bytes: DataTypes.BIGINT,
    mimetype: DataTypes.STRING(100),
    ordem: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'post_arquivo',
    timestamps: true,
    createdAt: 'enviado_em'
  });

  PostArquivo.associate = function(models) {
    PostArquivo.belongsTo(models.Post, { foreignKey: 'id_post' });
  };

  return PostArquivo;
};