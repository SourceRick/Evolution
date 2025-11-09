const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Professor = sequelize.define('Professor', {
    id_professor: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    cpf: {
      type: DataTypes.STRING(11),
      unique: true
    },
    email: {
      type: DataTypes.STRING(150),
      unique: true
    },
    telefone: DataTypes.STRING(20),
    especialidade: DataTypes.STRING(100),
    formacao: DataTypes.TEXT,
    lattes_url: DataTypes.STRING(500),
    foto_url: DataTypes.STRING(500),
    ativo: {
      type: DataTypes.ENUM('Ativo', 'Afastado', 'Desligado'),
      defaultValue: 'Ativo'
    }
  }, {
    tableName: 'professor',
    timestamps: true,
    createdAt: 'criado_em'
  });

  Professor.associate = function(models) {
    Professor.hasMany(models.User, { foreignKey: 'id_professor' });
    Professor.hasMany(models.Turma, { foreignKey: 'id_professor_coordenador' });
    Professor.hasMany(models.Aula, { foreignKey: 'id_professor' });
    Professor.hasMany(models.Agendamento, { foreignKey: 'id_professor' });
  };

  return Professor;
};