const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notificacao = sequelize.define('Notificacao', {
    id_notificacao: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Sistema', 'Atividade', 'Comentario', 'Reacao', 'Agendamento', 'Prazo', 'Mensagem'),
      defaultValue: 'Sistema'
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    link: DataTypes.STRING(500),
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    prioridade: {
      type: DataTypes.ENUM('baixa', 'media', 'alta', 'urgente'),
      defaultValue: 'media'
    },
    expira_em: DataTypes.DATE
  }, {
    tableName: 'notificacao',
    timestamps: true,
    createdAt: 'criada_em'
  });

  Notificacao.associate = function(models) {
    Notificacao.belongsTo(models.User, { foreignKey: 'id_usuario' });
  };

  return Notificacao;
};