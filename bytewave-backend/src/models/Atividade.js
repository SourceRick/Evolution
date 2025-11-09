const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Atividade = sequelize.define('Atividade', {
    id_atividade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    descricao: DataTypes.TEXT,
    tipo: {
      type: DataTypes.ENUM('Trabalho', 'Prova', 'Exercicio', 'Projeto', 'Apresentacao'),
      defaultValue: 'Trabalho'
    },
    data_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    data_entrega: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id_disciplina: DataTypes.INTEGER,
    id_turma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_professor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    valor_maximo: {
      type: DataTypes.DECIMAL(5,2),
      defaultValue: 10.00
    },
    instrucoes: DataTypes.TEXT,
    criterios_avaliacao: DataTypes.JSON,
    anexos_permitidos: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    tipos_arquivo_permitidos: DataTypes.JSON,
    tamanho_maximo_mb: {
      type: DataTypes.INTEGER,
      defaultValue: 10
    },
    ativa: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    visibilidade: {
      type: DataTypes.ENUM('Turma', 'Publico', 'Privado'),
      defaultValue: 'Turma'
    }
  }, {
    tableName: 'atividade',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Atividade.associate = function(models) {
    Atividade.belongsTo(models.Disciplina, { foreignKey: 'id_disciplina' });
    Atividade.belongsTo(models.Turma, { foreignKey: 'id_turma' });
    Atividade.belongsTo(models.Professor, { foreignKey: 'id_professor' });
    Atividade.hasMany(models.Trabalho, { foreignKey: 'id_atividade' });
    Atividade.hasMany(models.Post, { foreignKey: 'id_atividade' });
  };

  return Atividade;
};