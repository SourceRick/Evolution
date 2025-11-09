const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Mensagem = sequelize.define('Mensagem', {
    id_mensagem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_remetente: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_destinatario: DataTypes.INTEGER,
    id_turma: DataTypes.INTEGER,
    assunto: DataTypes.STRING(200),
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Individual', 'Turma', 'Geral'),
      defaultValue: 'Individual'
    },
    lida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    respondida: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'mensagem',
    timestamps: true,
    createdAt: 'criada_em'
  });

  Mensagem.associate = function(models) {
    Mensagem.belongsTo(models.User, { foreignKey: 'id_remetente', as: 'remetente' });
    Mensagem.belongsTo(models.User, { foreignKey: 'id_destinatario', as: 'destinatario' });
    Mensagem.belongsTo(models.Turma, { foreignKey: 'id_turma' });
  };

  return Mensagem;
};