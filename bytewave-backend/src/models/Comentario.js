const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Comentario = sequelize.define('Comentario', {
    id_comentario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_post: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_autor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_comentario_pai: DataTypes.INTEGER,
    editado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'comentario',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  Comentario.associate = function(models) {
    Comentario.belongsTo(models.Post, { foreignKey: 'id_post' });
    Comentario.belongsTo(models.User, { foreignKey: 'id_autor', as: 'autor' });
    Comentario.belongsTo(models.Comentario, { foreignKey: 'id_comentario_pai', as: 'pai' });
    Comentario.hasMany(models.Comentario, { foreignKey: 'id_comentario_pai', as: 'respostas' });
    Comentario.hasMany(models.Reacao, { foreignKey: 'id_comentario' });
  };

  return Comentario;
};