const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const JustificativaFalta = sequelize.define('JustificativaFalta', {
    id_justificativa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_presenca: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_aluno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('Medica', 'Familiar', 'Outros'),
      defaultValue: 'Outros'
    },
    descricao: DataTypes.TEXT,
    anexo_url: DataTypes.STRING(500),
    status: {
      type: DataTypes.ENUM('Pendente', 'Aprovada', 'Rejeitada'),
      defaultValue: 'Pendente'
    },
    avaliado_por: DataTypes.INTEGER,
    resposta: DataTypes.TEXT
  }, {
    tableName: 'justificativa_falta',
    timestamps: true,
    createdAt: 'criado_em'
  });

  JustificativaFalta.associate = function(models) {
    JustificativaFalta.belongsTo(models.Presenca, { foreignKey: 'id_presenca' });
    JustificativaFalta.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
    JustificativaFalta.belongsTo(models.User, { foreignKey: 'avaliado_por', as: 'avaliador' });
  };

  return JustificativaFalta;
};