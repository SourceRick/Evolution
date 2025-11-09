const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const GradeCurricular = sequelize.define('GradeCurricular', {
    id_grade: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_curso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_disciplina: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    semestre: DataTypes.INTEGER,
    ordem: DataTypes.INTEGER,
    pre_requisitos: DataTypes.JSON
  }, {
    tableName: 'grade_curricular'
  });

  GradeCurricular.associate = function(models) {
    GradeCurricular.belongsTo(models.Curso, { foreignKey: 'id_curso' });
    GradeCurricular.belongsTo(models.Disciplina, { foreignKey: 'id_disciplina' });
  };

  return GradeCurricular;
};