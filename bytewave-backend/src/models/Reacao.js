const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reacao = sequelize.define('Reacao', {
    id_reacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_post: DataTypes.INTEGER,
    id_comentario: DataTypes.INTEGER,
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('like', 'curtir', 'util', 'criativo', 'aplaudir'),
      defaultValue: 'like'
    }
  }, {
    tableName: 'reacao',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Reacao.associate = function(models) {
    Reacao.belongsTo(models.Post, { foreignKey: 'id_post' });
    Reacao.belongsTo(models.Comentario, { foreignKey: 'id_comentario' });
    Reacao.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return Reacao;
};