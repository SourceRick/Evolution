const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Post = sequelize.define('Post', {
    id_post: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: DataTypes.STRING(200),
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    id_autor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Trabalho', 'Duvida', 'Material', 'Anuncio', 'Evento', 'Discussao'),
      defaultValue: 'Discussao'
    },
    visibilidade: {
      type: DataTypes.ENUM('Publico', 'Turma', 'Curso', 'Privado'),
      defaultValue: 'Turma'
    },
    id_turma: DataTypes.INTEGER,
    id_curso: DataTypes.INTEGER,
    id_atividade: DataTypes.INTEGER,
    permite_comentarios: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fixado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'post',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  Post.associate = function(models) {
    Post.belongsTo(models.User, { foreignKey: 'id_autor', as: 'autor' });
    Post.belongsTo(models.Turma, { foreignKey: 'id_turma' });
    Post.belongsTo(models.Curso, { foreignKey: 'id_curso' });
    Post.belongsTo(models.Atividade, { foreignKey: 'id_atividade' });
    Post.hasMany(models.Comentario, { foreignKey: 'id_post' });
    Post.hasMany(models.Reacao, { foreignKey: 'id_post' });
    Post.hasMany(models.PostArquivo, { foreignKey: 'id_post' });
  };

  return Post;
};