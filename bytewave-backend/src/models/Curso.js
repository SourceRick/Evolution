const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Curso = sequelize.define('Curso', {
    id_curso: {
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
    descricao: DataTypes.TEXT,
    carga_horaria_total: DataTypes.INTEGER,
    id_departamento: DataTypes.INTEGER,
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'curso',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Curso.associate = function(models) {
    Curso.belongsTo(models.Departamento, { foreignKey: 'id_departamento' });
    Curso.hasMany(models.Turma, { foreignKey: 'id_curso' });
    Curso.hasMany(models.Disciplina, { foreignKey: 'id_curso' });
    Curso.hasMany(models.GradeCurricular, { foreignKey: 'id_curso' });
  };

  return Curso;
};