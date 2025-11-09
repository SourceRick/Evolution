const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Trabalho = sequelize.define('Trabalho', {
    id_trabalho: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_atividade: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_aluno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    titulo: DataTypes.STRING(200),
    conteudo: DataTypes.TEXT,
    data_entrega: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    data_avaliacao: DataTypes.DATE,
    nota: DataTypes.DECIMAL(5,2),
    comentario_professor: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('Rascunho', 'Entregue', 'Avaliado', 'Atrasado', 'Corrigir'),
      defaultValue: 'Rascunho'
    },
    versao: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    tempo_edicao_minutos: DataTypes.INTEGER
  }, {
    tableName: 'trabalho',
    timestamps: true,
    createdAt: 'criado_em',
    updatedAt: 'atualizado_em'
  });

  Trabalho.associate = function(models) {
    Trabalho.belongsTo(models.Atividade, { foreignKey: 'id_atividade' });
    Trabalho.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
    Trabalho.hasMany(models.ArquivoTrabalho, { foreignKey: 'id_trabalho' });
  };

  return Trabalho;
};