const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Aula = sequelize.define('Aula', {
    id_aula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_disciplina: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_turma: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_professor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_aula: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hora_inicio: DataTypes.TIME,
    hora_fim: DataTypes.TIME,
    conteudo_ministrado: DataTypes.TEXT,
    observacoes: DataTypes.TEXT,
    presenca_registrada: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'aula'
  });

  Aula.associate = function(models) {
    Aula.belongsTo(models.Disciplina, { foreignKey: 'id_disciplina' });
    Aula.belongsTo(models.Turma, { foreignKey: 'id_turma' });
    Aula.belongsTo(models.Professor, { foreignKey: 'id_professor' });
    Aula.hasMany(models.Presenca, { foreignKey: 'id_aula' });
  };

  return Aula;
};