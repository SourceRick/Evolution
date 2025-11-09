const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Matricula = sequelize.define('Matricula', {
    id_matricula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_aluno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_turma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    numero_matricula: {
      type: DataTypes.STRING(20),
      unique: true
    },
    data_matricula: DataTypes.DATE,
    data_conclusao_prevista: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM('Ativa', 'Trancada', 'Concluida', 'Cancelada'),
      defaultValue: 'Ativa'
    }
  }, {
    tableName: 'matricula',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Matricula.associate = function(models) {
    Matricula.belongsTo(models.Aluno, { foreignKey: 'id_aluno' });
    Matricula.belongsTo(models.Turma, { foreignKey: 'id_turma' });
  };

  return Matricula;
};