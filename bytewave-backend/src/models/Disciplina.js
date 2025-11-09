const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Disciplina = sequelize.define('Disciplina', {
    id_disciplina: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    codigo: {
      type: DataTypes.STRING(20),
      unique: true
    },
    carga_horaria: DataTypes.INTEGER,
    ementa: DataTypes.TEXT,
    objetivos: DataTypes.TEXT,
    bibliografia: DataTypes.TEXT,
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'disciplina'
  });

  Disciplina.associate = function(models) {
    Disciplina.belongsTo(models.Curso, { foreignKey: 'id_curso' });
    Disciplina.hasMany(models.GradeCurricular, { foreignKey: 'id_disciplina' });
    Disciplina.hasMany(models.Aula, { foreignKey: 'id_disciplina' });
    Disciplina.hasMany(models.Atividade, { foreignKey: 'id_disciplina' });
  };

  return Disciplina;
};