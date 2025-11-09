const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Turma = sequelize.define('Turma', {
    id_turma: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(20),
      unique: true
    },
    turno: {
      type: DataTypes.ENUM('Manha', 'Tarde', 'Noite', 'Integral'),
      defaultValue: 'Manha'
    },
    data_inicio: DataTypes.DATE,
    data_fim: DataTypes.DATE,
    capacidade_maxima: {
      type: DataTypes.INTEGER,
      defaultValue: 30
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_professor_coordenador: DataTypes.INTEGER,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'turma',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Turma.associate = function(models) {
    Turma.belongsTo(models.Curso, { foreignKey: 'id_curso' });
    Turma.belongsTo(models.Professor, { foreignKey: 'id_professor_coordenador', as: 'coordenador' });
    Turma.hasMany(models.Matricula, { foreignKey: 'id_turma' });
    Turma.hasMany(models.Aula, { foreignKey: 'id_turma' });
    Turma.hasMany(models.Atividade, { foreignKey: 'id_turma' });
    Turma.hasMany(models.Post, { foreignKey: 'id_turma' });
  };

  return Turma;
};